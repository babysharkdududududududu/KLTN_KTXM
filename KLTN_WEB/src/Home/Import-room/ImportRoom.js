import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { getRoomRoute, importRoomRoute } from '../../API/APIRouter';
import { Button, Card, CardContent, Typography, Snackbar, Alert, Box, LinearProgress, TextField, Gird, Grid } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const UploadRoom = () => {
    const [file, setFile] = useState(null);
    const [listRooms, setListRooms] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            setListRooms(data.data.results);
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
            showSnackbar('Vui lòng chọn một file trước.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            const isValid = jsonData.every(room => room.roomNumber && room.floor && room.block);
            if (!isValid) {
                showSnackbar('Dữ liệu không hợp lệ!', 'error');
                return;
            }
            const normalizedUserData = jsonData.map(room => ({
                roomNumber: String(room.roomNumber || '').toUpperCase(),
                floor: Number(room.floor),
                block: room.block,
                capacity: 16,
                availableSpot: 16,
                equipment: [{
                    name: room.equipment_name,
                    quantity: Number(room.equipment_quantity),
                }]
            }));
            const existingRoomNumbers = checkForExistingRoomNumbers(normalizedUserData);
            const duplicateRoomNumbersInFile = findDuplicateRoomNumber(normalizedUserData);
            const validRooms = normalizedUserData.filter(room =>
                !existingRoomNumbers.includes(room.roomNumber) &&
                !duplicateRoomNumbersInFile.includes(room.roomNumber)
            );


            if (validRooms.length === 0) {
                showSnackbar('Không có phòng hợp lệ để nhập!', 'warning');
                return;
            }

            setIsUploading(true);
            try {
                const response = await axios.post(importRoomRoute, validRooms, {
                    onUploadProgress: progressEvent => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                });
                showSnackbar('Import thành công!', 'success');
                fetchRooms();
            } catch (error) {
                console.error('Lỗi khi import:', error.response?.data || error.message);
                showSnackbar('Có lỗi xảy ra khi import dữ liệu.', 'error');
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
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

    const handleDownloadTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Mẫu');
        worksheet.columns = [
            { header: 'roomNumber', key: 'roomNumber', width: 20 },
            { header: 'floor', key: 'floor', width: 15 },
            { header: 'block', key: 'block', width: 15 },
            { header: 'capacity', key: 'capacity', width: 15 },
            { header: 'availableSpot', key: 'availableSpot', width: 20 }
        ];
        worksheet.getRow(1).font = { bold: true };
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Template_Phong.xlsx');
    };


    return (
        <Box display="flex" justifyContent="center" alignItems="center" >

            <CardContent>
                <TextField type="file" inputProps={{ accept: '.xlsx, .xls, .csv' }} onChange={handleFileChange} margin="normal" variant="outlined" />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={isUploading}>
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
                    Vui lòng chọn đúng định dạng file là .xlsx, .csv và đúng file dữ liệu phòng.
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

export default UploadRoom;
