import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider, Paper } from '@mui/material';
import { CheckCircle, Build } from '@mui/icons-material';

const RoomDialog = ({ open, onClose, selectedRoom, onSave }) => {
    const [block, setBlock] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [floor, setFloor] = useState('');
    const [status, setStatus] = useState(selectedRoom?.room?.status || 0);

    useEffect(() => {
        if (selectedRoom && selectedRoom.room) {
            setBlock(selectedRoom.room.block);
            setRoomNumber(selectedRoom.room.roomNumber);
            setFloor(selectedRoom.room.floor);
            setStatus(selectedRoom.room.status);
        }
    }, [selectedRoom]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle style={{
                fontSize: 24, fontWeight: 'bold', textAlign: 'center',
                backgroundColor: '#1976d2', color: '#fff', padding: '16px'
            }}>
                Thông tin phòng
            </DialogTitle>
            <DialogContent style={{ overflowY: 'auto', padding: '24px' }}>
                {selectedRoom && selectedRoom.room && (
                    <Grid container spacing={3}>
                        {/* Room Info */}
                        <Grid item xs={12}>
                            <Typography variant="h5" style={{
                                textAlign: 'center', marginBottom: '24px', color: '#1976d2', fontWeight: 'bold'
                            }}>
                                Phòng: {roomNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1"><strong>Tầng:</strong> {floor}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1"><strong>Khối:</strong> {block}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1"><strong>Trạng thái:</strong> {status === 0 ? 'Hoạt động' : 'Bảo trì'}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1"><strong>Sức chứa:</strong> {selectedRoom.room.capacity}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1"><strong>Số chỗ trống:</strong> {selectedRoom.room.availableSpot}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1"><strong>Số điện:</strong> {selectedRoom.room.electricityNumber}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1"><strong>Số nước:</strong> {selectedRoom.room.waterNumber}</Typography>
                        </Grid>

                        {/* Equipment List */}
                        <Grid item xs={12}>
                            <Divider style={{ margin: '24px 0' }} />
                            <Typography variant="h6" style={{
                                marginBottom: '16px', color: '#1976d2', fontWeight: 'bold'
                            }}><strong>Trang thiết bị:</strong></Typography>
                            <Paper style={{
                                padding: '16px', backgroundColor: '#f1f1f1', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Grid container spacing={2}>
                                    {selectedRoom.equipment.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"><strong>Loại:</strong> {item.name}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2">
                                                    <strong>Trạng thái:</strong>
                                                    {item.status === 1 ? (
                                                        <CheckCircle style={{ color: 'green', marginLeft: '8px' }} />
                                                    ) : (
                                                        <Build style={{ color: 'orange', marginLeft: '8px' }} />
                                                    )}
                                                </Typography>
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RoomDialog;
