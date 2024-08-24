import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

const RoomDialog = ({ open, onClose, selectedRoom }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f5f5f5', padding: '12px' }}>
                Thông tin phòng
            </DialogTitle>
            <DialogContent>
                {selectedRoom && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '8px', color: '#1976d2' }}>
                                {selectedRoom.roomNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Tầng:</strong> {selectedRoom.floor}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Khối:</strong> {selectedRoom.block}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Sức chứa:</strong> {selectedRoom.capacity}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Số chỗ trống:</strong> {selectedRoom.availableSpot}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Mô tả:</strong> {selectedRoom.description}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Loại phòng:</strong> {selectedRoom.type}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Trạng thái:</strong> {selectedRoom.status === 0 ? 'Hoạt động' : 'Bảo trì'}</Typography>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained">Đăng ký phòng</Button>
                <Button color="secondary" variant="outlined" onClick={onClose}>Hủy</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoomDialog;
