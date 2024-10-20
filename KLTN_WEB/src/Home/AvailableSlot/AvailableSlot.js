import { Alert, Box, CircularProgress, Container, Divider, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { getAllRoomRoute, getContractRoute, getRoomByIdRoute } from '../../API/APIRouter';
import { useUser } from '../../Context/Context';

const DoubleDoughnutChart = ({ total, used }) => {

    const dataUsed = [
        { name: 'Còn lại', value: total - used > 0 ? total - used : 0 },
        { name: 'Đã sử dụng', value: used },
    ];

    const dataTotal = [
        { name: 'Tổng số chỗ', value: total > 0 ? total : 1 },
        { name: 'Chỗ trống', value: 0 },
    ];

    return (
        <PieChart width={260} height={150} >
            <Pie data={dataUsed} cx="50%" cy="50%" innerRadius={35} outerRadius={50} fill="#8884d8" paddingAngle={0} dataKey="value" isAnimationActive={true} animationBegin={0} animationDuration={5000}>
                {dataUsed.map((entry, index) => (
                    <Cell key={`used-${index}`} fill={index === 1 ? '#51D126' : '#00e272'} />
                ))}
            </Pie>

            <Pie data={dataTotal} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={0} dataKey="value" isAnimationActive={true} animationBegin={0} animationDuration={5000} animationEasing="ease-in-out" startAngle={-270}>
                {dataTotal.map((entry, index) => (
                    <Cell key={`total-${index}`} fill={index === 0 ? '#2caffe' : 'transparent'} />
                ))}
            </Pie>

            <Tooltip />
            <Legend layout="vertical" align="left" verticalAlign="middle" wrapperStyle={{ paddingLeft: -10 }}
            />
        </PieChart >
    );
};

const AvailableSlot = () => {
    const { userId, roleId } = useUser();
    const [roomInfo, setRoomInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableSlot, setAvailableSlot] = useState(null);
    const [capacity, setCapacity] = useState(null);
    const [totalAvailableSlot, setTotalAvailableSlot] = useState(0);
    const [roomNumber, setRoomNumber] = useState(null);


    // API get all room to sum available slot
    const handleGetAllRoom = async () => {
        try {
            const rs = await axios.get(`${getAllRoomRoute}`);
            const roomData = rs.data.data.results;
            console.log("Room data:", roomData);
            const totalAvailableSlot = roomData.reduce((acc, room) => acc + room.availableSpot, 0);
            const totalCapacity = roomData.reduce((acc, room) => acc + room.capacity, 0);
            setTotalAvailableSlot(totalAvailableSlot);
            console.log("Total capacity slot:", totalCapacity);
            console.log("Total available slot:", totalAvailableSlot);
            console.log("Room data:");
        }
        catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        handleGetAllRoom();
    }, []);

    const handleGetContract = async () => {
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
            setRoomNumber(data.data.room.roomNumber);
            console.log("Room number:", roomNumber);
            console.log("Room info:", roomInfo);

            setAvailableSlot(data.data.room.availableSpot);
            setCapacity(data.data.room.capacity);
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
        <Container maxWidth="sm" sx={{ padding: 2, background: '#f5f5f5', borderRadius: '12px', maxHeight: '260px', minHeight: '217px' }}>
            {roleId === 'USERS' && (
                <>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    <Typography variant="h6" sx={{ marginBottom: 0.5, fontSize: '15px', textAlign: 'center', color: '#53556a' }}>
                        Phòng {roomNumber}
                    </Typography>
                    <Divider sx={{ marginBottom: 1 }} />
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2, fontSize: '0.8rem' }}>
                            {error}
                        </Alert>
                    )}
                    {roomInfo ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <DoubleDoughnutChart total={capacity} used={capacity - availableSlot} />
                        </Box>
                    ) : null}
                </>
            )}
        </Container>
    );

}

export default AvailableSlot;