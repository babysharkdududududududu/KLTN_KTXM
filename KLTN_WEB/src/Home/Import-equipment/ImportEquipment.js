import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { importEquipmentRoute, getEquipmentRoute, getRoomRoute } from '../../API/APIRouter';

const EquipmentUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [equipmentData, setEquipmentData] = useState([]);
    const [listRooms, setListRooms] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchEquipment = async () => {
        try {
            const response = await axios.get(getEquipmentRoute);
            setEquipmentData(response.data);
            console.log('Dữ liệu thiết bị:', response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu thiết bị:', error);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            setListRooms(data.data.results);
            console.log("Danh sách phòng:", data.data.results);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách phòng:", err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const checkForExistingEquipNumbers = async (equipmentData) => {
        try {
            const response = await axios.get(getEquipmentRoute);
            const existingEquipments = response.data.data;
            if (!Array.isArray(existingEquipments) || existingEquipments.length === 0) {
                return [];
            }
            const existingEquipNumbers = existingEquipments.map(equip => equip.equipNumber.toLowerCase());
            const duplicateEquipNumbers = equipmentData
                .map(equip => equip.equipNumber)
                .filter(equipNumber => existingEquipNumbers.includes(equipNumber.toLowerCase()));
            return duplicateEquipNumbers;
        } catch (error) {
            console.error('Lỗi khi kiểm tra thiết bị tồn tại:', error);
            throw new Error('Không thể kiểm tra thiết bị hiện có.');
        }
    };

    const checkRoomExist = (roomNumber) => {
        if (typeof roomNumber !== 'string') {
            console.error('roomNumber không phải là chuỗi:', roomNumber);
            return false;
        }

        const roomNumbers = listRooms.map(room => String(room.roomNumber).toLowerCase());
        return roomNumbers.includes(roomNumber.toLowerCase());
    };

    const findDuplicateEquipNumber = (equipmentData) => {
        const equipNumberCounts = {};
        equipmentData.forEach(equip => {
            const equipNumber = equip.equipNumber.toLowerCase();
            equipNumberCounts[equipNumber] = (equipNumberCounts[equipNumber] || 0) + 1;
        });
        return Object.keys(equipNumberCounts).filter(equipNumber => equipNumberCounts[equipNumber] > 1);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Vui lòng chọn một file trước.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            console.log('Dữ liệu từ file:', jsonData);

            const isValid = jsonData.every(equip => equip.equipNumber && equip.name && equip.status && equip.startDate);
            if (!isValid) {
                setMessage('Dữ liệu không hợp lệ!');
                return;
            }

            const normalizedEquipmentData = jsonData.map(equip => ({
                equipNumber: String(equip.equipNumber || '').toLowerCase(),
                name: equip.name,
                status: Number(equip.status),
                startDate: new Date(equip.startDate),
                endDate: equip.endDate ? new Date(equip.endDate) : null,
                fixedDate: equip.fixedDate ? new Date(equip.fixedDate) : null,
                location: equip.location || '',
                roomNumber: String(equip.roomNumber || '').toLowerCase()
            }));

            try {
                const existingEquipNumbers = await checkForExistingEquipNumbers(normalizedEquipmentData);
                console.log('Mã số thiết bị đã tồn tại:', existingEquipNumbers);
                const duplicateEquipNumbersInFile = findDuplicateEquipNumber(normalizedEquipmentData);
                console.log('Mã số thiết bị trùng trong file:', duplicateEquipNumbersInFile);

                const invalidRoomNumbers = normalizedEquipmentData
                    .map(equip => equip.roomNumber)
                    .filter(roomNumber => !checkRoomExist(roomNumber));

                if (invalidRoomNumbers.length > 0) {
                    setMessage(`Các mã phòng không tồn tại: ${invalidRoomNumbers.join(', ')}`);
                    return;
                }

                const validEquipment = normalizedEquipmentData.filter(equip =>
                    !existingEquipNumbers.includes(equip.equipNumber) &&
                    !duplicateEquipNumbersInFile.includes(equip.equipNumber)
                );

                console.log('Thiết bị hợp lệ:', validEquipment);

                if (validEquipment.length === 0) {
                    setMessage('Không có thiết bị hợp lệ để nhập!');
                    return;
                }

                setIsUploading(true);
                try {
                    const response = await axios.post(importEquipmentRoute, validEquipment, {
                        onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    });
                    console.log('Phản hồi từ server:', response.data);
                    setMessage('Import thiết bị thành công!');
                    fetchEquipment(); // Cập nhật danh sách thiết bị
                } catch (error) {
                    console.error('Lỗi khi import thiết bị:', error.response?.data || error.message);
                    setMessage(`Lỗi khi import thiết bị: ${error.response?.data?.message || error.message}`);
                } finally {
                    setIsUploading(false);
                }
            } catch (error) {
                console.error('Lỗi khi xử lý dữ liệu:', error);
                setMessage('Lỗi khi xử lý dữ liệu!');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <h2>Upload Equipment Data</h2>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
            {isUploading && <p>Đang tải lên... {uploadProgress}%</p>}
        </div>
    );
};

export default EquipmentUpload;
