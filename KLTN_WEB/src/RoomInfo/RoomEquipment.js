import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { Bed } from '@mui/icons-material';
import { createMaintenanceRoute } from '../API/APIRouter';
import axios from 'axios';

const RoomEquipment = ({ equipment, getRoomById, roomNumber }) => {
    const updateStatus = async (item) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

        const maintenanceNumber = `BT${roomNumber}-${item.name}-${formattedDate}-${formattedTime}`;

        console.log(maintenanceNumber, "maintenance number");

        try {
            const response = await axios.post(createMaintenanceRoute, {
                maintenanceNumber,
                item: item.name,
                status: 1,
                roomNumber,
            });
            await getRoomById();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    console.log("Maintenance number already exists.");
                } else {
                    console.log("Error:", error.response.data);
                }
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Error:", error.message);
            }
        }
    };

    const statusDetails = {
        0: { text: 'Hoạt động', color: 'green' }, 1: { text: 'Tiếp nhận', color: '#4caf50' }, 2: { text: 'Kiểm tra', color: '#1976d2' },
        3: { text: 'Xử lý', color: '#ff9800' }, 4: { text: 'Sửa chữa', color: '#9c27b0' }, 5: { text: 'Hoạt động', color: 'green' }, 6: { text: 'Không sửa được', color: '#d32f2f' },
    };

    return (
        <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                    <Bed sx={{ marginRight: 1 }} /> Trang Thiết Bị Trong Phòng
                </Typography>
                <Grid container spacing={2}>
                    {equipment.map((item, index) => (
                        <Grid item xs={6} key={index}>
                            <Paper elevation={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {item.name} ({item.quantity})
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: statusDetails[item.status]?.color || '#000',
                                        marginLeft: 2
                                    }}
                                >
                                    {statusDetails[item.status]?.text || 'Trạng thái không xác định'}
                                </Typography>

                                {(item.status === 0 || item.status === 5) && (
                                    <button onClick={() => updateStatus(item)} style={{ marginLeft: '10px', padding: '5px 10px', border: 'none', borderRadius: '5px', backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}> Báo hỏng </button>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Grid>
    );
};

export default RoomEquipment;
