import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { getRoomRoute, importRoomRoute, importUserRoute } from '../../API/APIRouter';

const UploadRoom = () => {
    const [file, setFile] = useState(null);
    const [listRooms, setListRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            setListRooms(data.data.results);
            console.log("Danh sách phòng:", data.data.results);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Function to find duplicate roomNumber in the uploaded file
    const findDuplicateRoomNumber = (results) => {
        const roomNumbers = {};
        const duplicates = [];

        results.forEach(room => {
            const roomNumberStr = String(room.roomNumber || '').toLowerCase();
            if (roomNumbers[roomNumberStr]) {
                duplicates.push(room.roomNumber);
            } else {
                roomNumbers[roomNumberStr] = true;
            }
        });

        return duplicates; // Trả về danh sách các phòng trùng lặp
    };

    const checkForExistingRoomNumbers = (jsonData) => {
        const existingRoomNumbers = listRooms.map(room => String(room.roomNumber || '').toLowerCase());
        const duplicates = jsonData.filter(room => existingRoomNumbers.includes(String(room.roomNumber || '').toLowerCase()));
        return duplicates.map(room => room.roomNumber);
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

            const isValid = jsonData.every(room =>
                room.roomNumber &&
                room.floor &&
                room.block &&
                room.equipment_name && // Kiểm tra tên thiết bị
                room.equipment_quantity // Kiểm tra số lượng thiết bị
            );

            if (!isValid) {
                alert('Dữ liệu không hợp lệ!');
                return;
            }

            // Normalize roomNumbers to lowercase to avoid case sensitivity issues
            const normalizedUserData = jsonData.map(room => ({
                roomNumber: String(room.roomNumber || '').toLowerCase(),
                floor: Number(room.floor), // Chuyển đổi floor thành số
                block: room.block,
                equipment: [{
                    name: room.equipment_name,
                    quantity: Number(room.equipment_quantity), // Chuyển đổi quantity thành số
                }]
            }));

            const existingRoomNumbers = checkForExistingRoomNumbers(normalizedUserData);
            console.log('Mã số phòng đã tồn tại:', existingRoomNumbers);

            const duplicateRoomNumbersInFile = findDuplicateRoomNumber(normalizedUserData);
            console.log('Mã số phòng trùng trong file:', duplicateRoomNumbersInFile);

            const validRooms = normalizedUserData.filter(room =>
                !existingRoomNumbers.includes(room.roomNumber) &&
                !duplicateRoomNumbersInFile.includes(room.roomNumber)
            );

            console.log('Phòng hợp lệ:', validRooms);

            if (validRooms.length === 0) {
                alert('Không có phòng hợp lệ để nhập!');
                return;
            }

            try {
                const response = await axios.post(importRoomRoute, validRooms);
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

export default UploadRoom;
