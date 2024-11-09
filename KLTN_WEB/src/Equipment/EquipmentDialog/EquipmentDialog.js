import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import EquipmentQRCode from '../EquipmentQR/EquipmentQR';

const statusColors = {
    1: '#4caf50',
    2: '#1976d2',
    3: '#ff9800',
    4: '#9c27b0',
    5: '#4caf50',
    6: '#d32f2f'
};
const statusText = {
    1: 'Hoạt động',
    2: 'Kiểm tra',
    3: 'Xử lý',
    4: 'Sửa chữa',
    5: 'Hoạt động',
    6: 'Không sửa được'
};

const EquipmentDialog = ({ open, onClose, equipment, updatedRoomNumber, onRoomNumberChange, onUpdate }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: 'white' }}>
                Thông tin chi tiết thiết bị
            </DialogTitle>
            <DialogContent
                dividers
                sx={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#f9f9f9' }} // Lighter background for contrast
            >
                {equipment && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" sx={{ marginBottom: '12px', fontWeight: '600' }}>
                                Tên thiết bị: <span style={{ fontWeight: 'normal' }}>{equipment.name}</span>
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Mã số:</strong> {equipment.equipNumber}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Trạng thái:</strong>
                                <span style={{ color: statusColors[equipment.status], fontWeight: 'bold' }}>
                                    {statusText[equipment.status] || 'Không xác định'}
                                </span>
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Ngày bắt đầu:</strong> {new Date(equipment.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Ngày kết thúc:</strong> {new Date(equipment.endDate).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                label="Số phòng"
                                fullWidth
                                value={updatedRoomNumber}
                                onChange={(e) => onRoomNumberChange(e.target.value)}
                                sx={{ marginBottom: '12px' }}
                            />
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Số lần sửa chữa:</strong> {equipment.repairNumber}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Vị trí:</strong> [
                                {equipment.location.map((loc, index) => (
                                    index === equipment.location.length - 1 ? (
                                        <span style={{ color: 'red' }} key={index}>'{loc}'</span>
                                    ) : (
                                        <span key={index}>'{loc}', </span>
                                    )
                                ))}
                                ]
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Ngày sửa chữa:</strong> {new Date(equipment.fixedDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                                <strong>Lịch sử sửa chữa:</strong>
                            </Typography>
                            <ul style={{ paddingLeft: '20px', marginBottom: '8px' }}>
                                {equipment.repairHistory.map((date, index) => (
                                    <li key={index} style={{ marginBottom: '-4px', listStyle: 'none' }}>{new Date(date).toLocaleString()}</li>
                                ))}
                            </ul>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <EquipmentQRCode equipment={equipment} />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Hủy</Button>
                <Button onClick={onUpdate} color="primary" variant="contained">Cập nhật</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EquipmentDialog;
