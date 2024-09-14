import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { getRoomRoute, getRoomByIdRoute } from '../../API/APIRouter';
import axios from 'axios';
import RoomDialog from './RoomDialog';
import Pagination from '@mui/material/Pagination';  // Import Material-UI Pagination
import '../TableData.css';

const TableData = ({ filterBlock }) => {
    const [listRooms, setListRooms] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRoom, setSelectedRoom] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const roomsPerPage = 15;  // Set how many rooms per page

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            const filteredRooms = filterBlock ? data.data.results.filter(room => room.block === filterBlock) : data.data.results;
            setListRooms(filteredRooms);
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
    };

    // Filter rooms and calculate pagination
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
        <div style={{ height: '100%', width: '100%' }}>
            <Grid container columnSpacing={-20.9} style={{ padding: '16px' }} rowSpacing={1}>
                {currentRooms.length > 0 ? (
                    currentRooms.map((room) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.1} key={room.id}>
                            <Card onClick={() => handleCardClick(room)} style={{ marginLeft: -60, cursor: 'pointer', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s', height: '200px', overflow: 'hidden', width: '200px' }}>
                                <CardHeader title={`Phòng ${room.roomNumber}`} subheader={`Tầng: ${room.floor}, Khối: ${room.block}`} style={{ backgroundColor: '#e3f2fd', borderBottom: '1px solid #bbdefb', padding: '8px 16px' }} />
                                <CardContent style={{ padding: '8px 16px', height: "10px" }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" style={{ fontSize: '0.65rem' }}><strong>Sức chứa:</strong> {room.capacity}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" style={{ fontSize: '0.65rem' }}><strong>Chỗ trống:</strong> {room.availableSpot}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" style={{ fontSize: '0.65rem' }}><strong>Mô tả:</strong> {room.description}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" style={{ fontSize: '0.65rem' }}><strong>Loại phòng:</strong> {room.type}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center' }}>
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', position: 'absolute', bottom: 10, left: '45%' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                />
            </div>

            <RoomDialog
                open={openDialog}
                onClose={handleCloseDialog}
                selectedRoom={selectedRoom}
                fetchRooms={fetchRooms}
            />
        </div>
    );
};

export default TableData;
