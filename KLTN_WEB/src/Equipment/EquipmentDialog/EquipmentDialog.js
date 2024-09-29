import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid } from '@mui/material';
import EquipmentQRCode from '../EquipmentQR/EquipmentQR';

const statusColors = { 1: '#4caf50', 2: '#1976d2', 3: '#ff9800', 4: '#9c27b0', 5: '#4caf50', 6: '#d32f2f' };
const statusText = { 1: 'Hoạt động', 2: 'Kiểm tra', 3: 'Xử lý', 4: 'Sửa chữa', 5: 'Hoạt động', 6: 'Không sửa được' };

const EquipmentDialog = ({ open, onClose, equipment, updatedRoomNumber, onRoomNumberChange, onUpdate }) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Thông tin chi tiết thiết bị</DialogTitle>
        <DialogContent dividers sx={{ padding: '24px' }}>
            {equipment && (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                            <strong>Tên thiết bị:</strong> {equipment.name}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                            <strong>Mã số:</strong> {equipment.equipNumber}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                            <strong>Trạng thái:</strong>
                            <span style={{ color: statusColors[equipment.status] }}>
                                {statusText[equipment.status] || 'Không xác định'}
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
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
                        <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                            <strong>Số lần sửa chữa:</strong> {equipment.repairNumber}
                        </Typography>
                        <Typography variant="body1">
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
                        <Typography variant="body1">
                            <strong>Ngày sửa chữa:</strong> {new Date(equipment.fixedDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Lịch sử sửa chữa:</strong>
                        </Typography>
                        <ul>
                            {equipment.repairHistory.map((date, index) => (
                                <li key={index}>{new Date(date).toLocaleString()}</li>
                            ))}
                        </ul>
                        <EquipmentQRCode equipment={equipment} />
                    </Grid>
                </Grid>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary" variant="contained">Hủy</Button>
            <Button onClick={onUpdate} color="primary" variant="contained">Cập nhật</Button>
        </DialogActions>
    </Dialog>
);

export default EquipmentDialog;
