import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { getAllUserRoute, importUserRoute } from '../../API/APIRouter';
import {
    Button,
    Typography,
    LinearProgress,
    TextField,
    Box,
    Snackbar,
    Alert,
    Divider,
    Paper,
    CardContent
} from '@mui/material';

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
            setUserData(response.data.data);
            console.log('Dữ liệu người dùng:', response.data.data);
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
        if (!userData) return []; // Trả về mảng rỗng nếu userData không có giá trị

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

            const errors = [];

            // Kiểm tra tính hợp lệ của dữ liệu
            jsonData.forEach((user, index) => {
                if (!user.name || !user.email || !user.userId || !user.password || typeof user.isActive !== 'boolean') {
                    errors.push(`Dòng ${index + 1}: Thiếu trường bắt buộc hoặc giá trị không hợp lệ.`);
                }
            });

            if (errors.length > 0) {
                showSnackbar(`Lỗi dữ liệu:\n${errors.join('\n')}`, 'error');
                return;
            }

            const normalizedUserData = jsonData.map(user => ({
                ...user,
                userId: String(user.userId || '').toLowerCase(),
            }));

            const existingUserIds = checkForExistingUserIds(normalizedUserData);
            const duplicateUserIdsInFile = findDuplicateUserIds(normalizedUserData);

            if (existingUserIds.length > 0) {
                errors.push(`Các userId đã tồn tại: ${existingUserIds.join(', ')}`);
            }
            if (duplicateUserIdsInFile.length > 0) {
                errors.push(`Các userId trùng lặp trong file: ${duplicateUserIdsInFile.join(', ')}`);
            }

            // Lọc user hợp lệ
            const validUsers = normalizedUserData.filter(user =>
                !existingUserIds.includes(user.userId) &&
                !duplicateUserIdsInFile.includes(user.userId)
            );

            if (errors.length > 0) {
                showSnackbar(`Lỗi dữ liệu:\n${errors.join('\n')}`, 'error');
                return;
            }

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

                // Làm mới danh sách user
                handleGetAllUser();

                // Đặt lại trạng thái file
                setFile(null);
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
        <Box display="flex" justifyContent="center" alignItems="center" >
            <CardContent >

                <TextField type="file" inputProps={{ accept: '.xlsx, .xls, .csv' }} margin="normal" onChange={handleFileChange} variant="outlined" />

                <Button variant="contained" color="primary" fullWidth onClick={handleUpload} disabled={isUploading} >
                    {isUploading ? `Đang tải lên... ${uploadProgress}%` : 'Tải lên'}
                </Button>

                <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>
                    Vui lòng chọn đúng định dạng file là .xlsx, .csv và đúng file dữ liệu sinh viên.
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

export default UploadXLSX;
