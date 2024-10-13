import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/Context';
import { getContractRoute, getRoomByIdRoute } from '../../API/APIRouter';
import { Container, Typography, Alert, CircularProgress, Box, Divider } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LayersIcon from '@mui/icons-material/Layers';

const RoomInfo = () => {
    const { userId } = useUser();
    const [roomInfo, setRoomInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetContract = async () => {
        setLoading(true);
        setLoading(true);
        try {
            const response = await axios.get(`${getContractRoute}/${userId}`);
            const { roomNumber } = response.data.data.contract;
            getRoomById(roomNumber);
        } catch (error) {
            console.error("Error fetching contract:", error);
            setError("Failed to fetch contract.");
            setLoading(false);
        }
    };

    const getRoomById = async (roomNumber) => {
        try {
            const { data } = await axios.get(`${getRoomByIdRoute}${roomNumber}`);
            setRoomInfo(data.data.room);
            console.log("Room info:", roomInfo);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching room by ID:", err);
            setError("Failed to fetch room information.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            handleGetContract();
        }
    }, [userId]);

    return (
        <Container>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress />
                </Box>
            )}
            <Typography variant="h6" >Thông tin phòng</Typography>
            <Divider />
            {error && <Alert severity="error" >{error}</Alert>}
            {roomInfo && (
                <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MeetingRoomIcon color="primary" />
                        <Typography variant="caption"><strong>Số phòng:</strong> {roomInfo.roomNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LayersIcon color="primary" />
                        <Typography variant="caption"><strong>Tầng:</strong> {roomInfo.floor}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ApartmentIcon color="primary" />
                        <Typography variant="caption"><strong>Block:</strong> {roomInfo.block}</Typography>
                    </Box>
                </Box>
            )}
        </Container>
    );
}

export default RoomInfo;
