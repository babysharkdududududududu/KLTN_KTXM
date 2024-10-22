import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, Typography } from '@mui/material';

const EquipmentQRCode = ({ equipment }) => {
    if (!equipment) return null;

    const qrData = `
        Tên thiết bị: ${equipment.name}
        Mã số: ${equipment.equipNumber}
        Số phòng: ${equipment.roomNumber}
        Ngày bắt đầu: ${new Date(equipment.startDate).toLocaleDateString()}
        Ngày kết thúc: ${new Date(equipment.endDate).toLocaleDateString()}
    `.trim();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                Mã QR của thiết bị
            </Typography>
            <QRCodeCanvas value={qrData} />
        </Box>
    );
};

export default EquipmentQRCode;
