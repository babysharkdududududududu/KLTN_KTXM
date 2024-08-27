import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
import { useUser } from '../../Context/Context';
import { registerRoomRoute } from '../../API/APIRouter';
import axios from 'axios';
import ModalSuccess from './ModalSuccess';

const RoomDialog = ({ open, onClose, selectedRoom, fetchRooms }) => {
    const { userId } = useUser();
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [isSuccess, setIsSuccess] = useState(true);

    const handleRegisterRoom = async () => {
        const block = selectedRoom.block;
        const roomNumber = selectedRoom.roomNumber;
        const floor = selectedRoom.floor;
        const now = new Date();
        const formattedDate = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
        const contractNumber = `${block}${floor}${roomNumber}-${userId}-${formattedDate}`;
        console.log(contractNumber, "register room");
        try {
            const rs = await axios.post(registerRoomRoute, { contractNumber, roomNumber, userId });
            if (rs.status === 201) {
                console.log('Đăng ký phòng thành công!');
                setIsSuccess(true);
                setOpenModalSuccess(true);
                fetchRooms();
            }
        } catch (error) {
            if (error.response) {
                console.log(`Lỗi: ${error.response.status} - ${error.response.data.message}`);
                setIsSuccess(false);
                setOpenModalSuccess(true);
            } else {
                console.log('Lỗi không xác định:', error);
            }
        }
    };

    return (
        <>
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
                    <Button onClick={handleRegisterRoom} color="primary" variant="contained">Đăng ký phòng</Button>
                    <Button color="secondary" variant="outlined" onClick={onClose}>Hủy</Button>
                </DialogActions>
            </Dialog>

            <ModalSuccess open={openModalSuccess} onClose={() => { setOpenModalSuccess(false); onClose(); }} success={isSuccess} />
        </>
    );
};

export default RoomDialog;
