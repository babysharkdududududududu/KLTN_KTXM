import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid, Button } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { getRoomRoute, getRoomByIdRoute } from '../../API/APIRouter';
import axios from 'axios';
import RoomDialog from './RoomDialog';

import '../TableData.css';

const TableData = ({ filterBlock }) => {
    const [listRooms, setListRooms] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [newEquipment, setNewEquipment] = React.useState({ name: '', quantity: 0 });
    const [currentPage, setCurrentPage] = React.useState(1);
    const roomsPerPage = 12;

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            const filteredRooms = filterBlock ? data.data.results.filter(room => room.block === filterBlock) : data.data.results;
            setListRooms(filteredRooms);
            // Reset to the first page whenever the filter changes
            setCurrentPage(1);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    React.useEffect(() => {
        fetchRooms();
    }, [filterBlock]);

    const getRoomById = async (id) => {
        try {
            const { data } = await axios.get(`${getRoomByIdRoute}${id}`);
            return data.data;
        } catch (err) {
            console.error("Error fetching room by ID:", err);
            return null;
        }
    };

    const handleCardClick = async (room) => {
        const roomData = await getRoomById(room.roomNumber);
        if (roomData) {
            setSelectedRoom(roomData);
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRoom(null);
        setNewEquipment({ name: '', quantity: 0 });
    };

    const rows = listRooms.filter(room => room.status === 0 && room.availableSpot !== 0).map((room) => ({
        id: room._id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        block: room.block,
        capacity: room.capacity,
        availableSpot: room.availableSpot,
        description: room.description || 'N/A',
        type: room.type || 'N/A',
        status: room.status === 0 ? 'Hoạt động' : 'Bảo trì',
    }));

    const totalPages = Math.ceil(rows.length / roomsPerPage);
    const currentRooms = rows.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

    return (
        <div style={{ height: '81%', width: '100%', backgroundColor: "#fff" }}>
            <Grid container spacing={2} style={{ padding: '16px' }}>
                {currentRooms.length > 0 ? (
                    currentRooms.map((room) => (
                        <Grid item xs={12} sm={6} md={3} key={room.id}>
                            <Card
                                onClick={() => handleCardClick(room)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    transition: 'transform 0.2s',
                                    marginBottom: '10px',
                                    height: '280px',
                                    overflow: 'hidden',
                                }}
                            >
                                <CardHeader
                                    title={`Phòng ${room.roomNumber}`}
                                    subheader={`Tầng: ${room.floor}, Khối: ${room.block}`}
                                    style={{ backgroundColor: '#e3f2fd', borderBottom: '1px solid #bbdefb', height: '50px' }}

                                />
                                <CardContent style={{ overflow: 'auto', maxHeight: '200px' }}> {/* Giới hạn chiều cao cho nội dung */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2"><strong>Sức chứa:</strong> {room.capacity}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2"><strong>Số chỗ trống:</strong> {room.availableSpot}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2"><strong>Mô tả:</strong> {room.description}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2"><strong>Loại phòng:</strong> {room.type}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
                                                <strong>Trạng thái:</strong>
                                                {room.status === 'Bảo trì' ? (
                                                    <Warning style={{ color: 'red', marginLeft: 4 }} />
                                                ) : (
                                                    <CheckCircle style={{ color: 'green', marginLeft: 4 }} />
                                                )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body2" style={{ padding: '16px', textAlign: 'center', width: '100%' }}>Không có phòng nào trong khối này.</Typography>
                )}
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button variant="contained" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trước</Button>
                <Typography variant="body2" style={{ margin: '0 16px' }}>
                    Trang {currentPage} / {totalPages}
                </Typography>
                <Button variant="contained" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Sau</Button>
            </div>
            <RoomDialog
                open={openDialog}
                onClose={handleCloseDialog}
                selectedRoom={selectedRoom}
                newEquipment={newEquipment}
            />
        </div>
    );
};

export default TableData;
