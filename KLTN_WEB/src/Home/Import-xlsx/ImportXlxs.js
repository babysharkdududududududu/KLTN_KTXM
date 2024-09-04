import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { getAllUserRoute, importUserRoute } from '../../API/APIRouter';
import { Button, Typography, LinearProgress, TextField, Box, Snackbar, Alert, Divider, Paper } from '@mui/material';

const UploadXLSX = () => {
    const [file, setFile] = useState(null);
    const [userData, setUserData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            setUserData(response.data.data.results);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
    };

    useEffect(() => {
        handleGetAllUser();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadProgress(0);
    };

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
        return jsonData.filter(user => existingUserIds.includes(String(user.userId || '').toLowerCase()))
            .map(user => user.userId);
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

            const isValid = jsonData.every(user => user.name && user.email && user.userId && user.password && (user.isActive === true || user.isActive === false));

            if (!isValid) {
                showSnackbar('Dữ liệu không hợp lệ!', 'error');
                return;
            }

            const normalizedUserData = jsonData.map(user => ({
                ...user,
                userId: String(user.userId || '').toLowerCase(),
            }));

            const existingUserIds = checkForExistingUserIds(normalizedUserData);
            const duplicateUserIdsInFile = findDuplicateUserIds(normalizedUserData);

            const validUsers = normalizedUserData.filter(user =>
                !existingUserIds.includes(user.userId) &&
                !duplicateUserIdsInFile.includes(user.userId)
            );

            if (validUsers.length === 0) {
                showSnackbar('Không có người dùng hợp lệ để nhập!', 'warning');
                return;
            }

            setIsUploading(true);
            try {
                const response = await axios.post(importUserRoute, validUsers, {
                    onUploadProgress: progressEvent => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                });
                showSnackbar('Import thành công!', 'success');
                handleGetAllUser();
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

    return (
        <Box display="flex" >
            <Box elevation={3} sx={{ padding: 2, borderRadius: 2, maxWidth: 400, minHeight: 150, background: '#f5f5f5' }}>
                <Typography gutterBottom sx={{ fontFamily: 'Tahoma', textAlign: 'center', fontSize: 16 }}>Tải lên dữ liệu sinh viên</Typography>
                <Divider sx={{ marginBottom: 2 }} />

                <TextField type="file" inputProps={{ accept: '.xlsx, .xls, .csv' }} onChange={handleFileChange} variant="outlined" fullWidth
                    sx={{ marginBottom: 2, '& input': { padding: '4px 8px', }, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: 14, }, '& .MuiInputLabel-root': { fontSize: 14, }, '& .MuiSvgIcon-root': { fontSize: 18, } }}
                />

                <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={isUploading}
                    sx={{ padding: '4px 8px', fontSize: 12, minHeight: '36px' }}>
                    {isUploading ? `Đang tải lên... ${uploadProgress}%` : 'Tải lên'}
                </Button>

                <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 1, fontSize: 12 }}> Vui lòng chọn đúng định dạng file là .xlsx, .csv và đúng file dữ liệu sinh viên.</Typography>

                {isUploading && (<LinearProgress variant="determinate" value={uploadProgress} sx={{ marginTop: 2 }} />)}
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert>
            </Snackbar>
        </Box>
    );
};

export default UploadXLSX;
