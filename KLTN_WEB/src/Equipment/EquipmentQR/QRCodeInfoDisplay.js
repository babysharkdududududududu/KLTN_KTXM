import React from 'react';
import { Box, Typography } from '@mui/material';

const QRCodeInfoDisplay = ({ data }) => {
    if (!data) return null;

    // Split the QR code data into lines and parse them
    const parseData = (data) => {
        const lines = data.split('\n');
        const info = {};
        lines.forEach(line => {
            const [key, value] = line.split(': ');
            if (key && value) info[key] = value;
        });
        return info;
    };

    const info = parseData(data);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>Thông tin thiết bị</Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                <strong>Tên thiết bị:</strong> {info['Tên thiết bị']}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                <strong>Mã số:</strong> {info['Mã số']}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                <strong>Số phòng:</strong> {info['Số phòng']}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                <strong>Ngày bắt đầu:</strong> {info['Ngày bắt đầu']}
            </Typography>
            <Typography variant="body1">
                <strong>Ngày kết thúc:</strong> {info['Ngày kết thúc']}
            </Typography>
        </Box>
    );
};

export default QRCodeInfoDisplay;
