import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { importEquipmentRoute, getEquipmentRoute, getRoomRoute } from '../../API/APIRouter';
import { Button, Card, CardContent, Typography, Snackbar, Alert, Box, LinearProgress, TextField, Grid, } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const EquipmentUpload = () => {
    const [file, setFile] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [equipmentData, setEquipmentData] = useState([]);
    const [listRooms, setListRooms] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDownloadTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Mẫu');
        // Định nghĩa các tên cột
        worksheet.columns = [
            { header: 'equipNumber', key: 'equipNumber', width: 20 }, { header: 'name', key: 'name', width: 25 }, { header: 'status', key: 'status', width: 15 }, { header: 'startDate', key: 'startDate', width: 15 }, { header: 'endDate', key: 'endDate', width: 15 },
            { header: 'fixedDate', key: 'fixedDate', width: 15 }, { header: 'location', key: 'location', width: 20 }, { header: 'roomNumber', key: 'roomNumber', width: 10 }
        ];
        // Làm đậm tên cột
        worksheet.getRow(1).font = { bold: true };
        // Tạo file Excel và tải xuống
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Template_Thiet_Bi.xlsx');
    };




    const fetchEquipment = async () => {
        try {
            const response = await axios.get(getEquipmentRoute);
            setEquipmentData(response.data);
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
            showSnackbar('Vui lòng chọn một file trước.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            const isValid = jsonData.every(equip => equip.equipNumber && equip.name && equip.status && equip.startDate);
            if (!isValid) {
                showSnackbar('Dữ liệu không hợp lệ!', 'error');
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
                roomNumber: String(equip.roomNumber || '').toUpperCase(),
            }));

            try {
                const existingEquipNumbers = await checkForExistingEquipNumbers(normalizedEquipmentData);
                const duplicateEquipNumbersInFile = findDuplicateEquipNumber(normalizedEquipmentData);

                const invalidRoomNumbers = normalizedEquipmentData
                    .map(equip => equip.roomNumber)
                    .filter(roomNumber => !checkRoomExist(roomNumber));

                if (invalidRoomNumbers.length > 0) {
                    showSnackbar(`Các mã phòng không tồn tại: ${invalidRoomNumbers.join(', ')}`, 'error');
                    return;
                }

                const validEquipment = normalizedEquipmentData.filter(equip =>
                    !existingEquipNumbers.includes(equip.equipNumber) &&
                    !duplicateEquipNumbersInFile.includes(equip.equipNumber)
                );


                if (validEquipment.length === 0) {
                    showSnackbar('Không có thiết bị hợp lệ để nhập!', 'warning');
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
                    showSnackbar('Import thiết bị thành công!', 'success');
                    fetchEquipment(); // Cập nhật danh sách thiết bị
                } catch (error) {
                    console.error('Lỗi khi import thiết bị:', error.response?.data || error.message);
                    showSnackbar(`Lỗi khi import thiết bị: ${error.response?.data?.message || error.message}`, 'error');
                } finally {
                    setIsUploading(false);
                }
            } catch (error) {
                console.error('Lỗi khi xử lý dữ liệu:', error);
                showSnackbar('Lỗi khi xử lý dữ liệu!', 'error');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" >
            <CardContent>
                <TextField type="file" inputProps={{ accept: '.xlsx, .xls, .csv' }} onChange={handleFileChange} fullWidth margin="normal" variant="outlined" />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={handleUpload} disabled={isUploading} fullWidth>
                            {isUploading ? `Đang tải lên... ${uploadProgress}%` : 'Tải lên'}
                            <UploadIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="success" fullWidth onClick={handleDownloadTemplate}>
                            Tải mẫu
                            <DownloadIcon />
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>
                    Vui lòng chọn đúng định dạng file là .xlsx, .csv và đúng file dữ liệu thiết bị.
                </Typography>
                {isUploading && (
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ marginTop: 2 }} />
                )}
            </CardContent>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EquipmentUpload;
