import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { checkUserRoute, getAllUserRoute, importUserRoute } from '../../API/APIRouter';

const UploadXLSX = () => {
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState([]);

    // Fetch all users from the server
    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(`${getAllUserRoute}`);
            console.log(response.data.data.results);
            setUserData(response.data.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetAllUser();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Function to find duplicate userIds in the uploaded file
    const findDuplicateUserIds = (results) => {
        const userIds = {};
        const duplicates = [];

        results.forEach(user => {
            const userIdStr = String(user.userId || '').toLowerCase();
            if (userIds[userIdStr]) {
                duplicates.push(user.userId);
            } else {
                userIds[userIdStr] = true;
            }
        });

        return [...new Set(duplicates)];
    };



    const checkForExistingUserIds = (jsonData) => {
        const existingUserIds = userData.map(user => String(user.userId || '').toLowerCase());
        const duplicates = jsonData.filter(user => existingUserIds.includes(String(user.userId || '').toLowerCase()));
        return duplicates.map(user => user.userId);
    };



    const filterValidUsers = (jsonData, duplicateIdsInFile) => {
        return jsonData.filter(user => !duplicateIdsInFile.includes(user.userId));
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            console.log('Dữ liệu từ file:', jsonData); // Kiểm tra dữ liệu từ file

            const isValid = jsonData.every(user =>
                user.name &&
                user.email &&
                user.userId &&
                user.password &&
                // user.phone &&
                // user.address &&
                // user.image &&
                // user.role &&
                // user.accountType &&
                (user.isActive === true || user.isActive === false)
                // user.codeId &&
                // user.codeExpired
            );

            if (!isValid) {
                alert('Dữ liệu không hợp lệ!');
                return;
            }

            // Normalize userIds to lowercase to avoid case sensitivity issues
            const normalizedUserData = jsonData.map(user => ({
                ...user,
                userId: String(user.userId || '').toLowerCase(),
            }));

            const existingUserIds = checkForExistingUserIds(normalizedUserData);
            console.log('Mã số người dùng đã tồn tại:', existingUserIds);

            const duplicateUserIdsInFile = findDuplicateUserIds(normalizedUserData);
            console.log('User ID trùng trong file:', duplicateUserIdsInFile);

            const validUsers = normalizedUserData.filter(user =>
                !existingUserIds.includes(user.userId) &&
                !duplicateUserIdsInFile.includes(user.userId)
            );

            console.log('Người dùng hợp lệ:', validUsers);

            if (validUsers.length === 0) {
                alert('Không có người dùng hợp lệ để nhập!');
                return;
            }

            try {
                const response = await axios.post(importUserRoute, validUsers);
                console.log('Phản hồi từ server:', response.data);
                alert('Import thành công!');
            } catch (error) {
                console.error('Lỗi khi import:', error.response?.data || error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    };




    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadXLSX;
