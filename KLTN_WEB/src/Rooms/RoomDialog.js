import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, Select, MenuItem, TextField, InputLabel, Grid } from '@mui/material';
import { CheckCircle, Build } from '@mui/icons-material'; // Import icons
const RoomDialog = ({ open, onClose, selectedRoom, onChange, onSave, newEquipment, onNewEquipmentChange, onAddEquipment }) => {
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
            <DialogTitle style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f5f5f5', padding: '16px' }}>
                Thông tin phòng
            </DialogTitle>
            <DialogContent>
                {selectedRoom && selectedRoom.room && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '16px', color: '#1976d2' }}>
                                {roomNumber}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Tầng:</strong> {floor}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Khối:</strong> {block}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="status-label">Trạng thái</InputLabel>
                                <Select labelId="status-label" name="status" value={status} onChange={(e) => { setStatus(e.target.value); onChange(e); }}>
                                    <MenuItem value={0}>Hoạt động</MenuItem>
                                    <MenuItem value={1}>Bảo trì</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="type-label">Loại phòng</InputLabel>
                                <Select labelId="type-label" name="type" value={selectedRoom.room.type} onChange={onChange}>
                                    <MenuItem value="VIP">VIP</MenuItem>
                                    <MenuItem value="Normal">Normal</MenuItem>
                                    <MenuItem value="Customer">Customer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField inputProps={{ readOnly: true }} label="Sức chứa" name="capacity" type="number" value={selectedRoom.room.capacity} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField inputProps={{ readOnly: true }} label="Số chỗ trống" name="availableSpot" type="number" value={selectedRoom.room.availableSpot} fullWidth margin="normal" />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField label="Mô tả" name="description" value={selectedRoom.room.description} onChange={onChange} fullWidth margin="normal" multiline rows={2} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField label="Số điện" name="electricityNumber" type="number" value={selectedRoom.room.electricityNumber} onChange={onChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Số nước" name="waterNumber" type="number" value={selectedRoom.room.waterNumber} onChange={onChange} fullWidth margin="normal" />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginBottom: '8px' }}><strong>Trang thiết bị:</strong></Typography>
                            {selectedRoom.equipment.map((item, index) => (
                                <Grid container spacing={1} key={index} alignItems="center">
                                    <Grid item xs={6}>
                                        <FormControl fullWidth margin="dense">
                                            <Grid name={`type-${index}`} value={item.name} onChange={onChange}>
                                                <Typography value={item.name}>{item.name}</Typography>
                                            </Grid>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            <strong>Trạng thái:</strong>
                                            {item.status === 0 ? (
                                                <CheckCircle style={{ color: 'green', marginLeft: '8px' }} />
                                            ) : (
                                                <Build style={{ color: 'orange', marginLeft: '8px' }} />
                                            )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={10}>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel>Loại mới</InputLabel>
                                        <Select name="name" value={newEquipment.name} onChange={onNewEquipmentChange}>
                                            <MenuItem value="Quạt">Quạt</MenuItem>
                                            <MenuItem value="Đèn">Đèn</MenuItem>
                                            <MenuItem value="Bàn">Bàn</MenuItem>
                                            <MenuItem value="Giường">Giường</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* <Grid item xs={4}>
                                    <TextField margin="dense" label="Số lượng" name="quantity" type="number" value={newEquipment.quantity} onChange={onNewEquipmentChange} />
                                </Grid> */}
                                <Grid item xs={2}>
                                    <Button onClick={onAddEquipment} color="primary" fullWidth variant="contained">Thêm</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Hủy</Button>
                <Button onClick={onSave} color="primary">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoomDialog;
