import { MonetizationOn } from '@mui/icons-material';
import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getContractRoute, getRoomByIdRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import RoomDetails from './RoomDetail';
import RoomEquipment from './RoomEquipment';
import styles from './RoomInfo.module.css';
import RoomMembers from './RoomMember';

const RoomInfo = () => {
    const { userId } = useUser();
    const [contract, setContract] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [roomNumber, setRoomNumber] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    const waterNumber = 10;
    const electricityNumber = 5;

    const waterCostPerCub = 5000;
    const electricityCostPerKg = 3000;

    const calculateCosts = () => {
        const waterCost = waterNumber * waterCostPerCub;
        const electricityCost = electricityNumber * electricityCostPerKg;
        const totalCost = waterCost + electricityCost;
        return { waterCost, electricityCost, totalCost };
    };

    const { waterCost, electricityCost, totalCost } = calculateCosts();

    const handleGetContract = async () => {
        try {
            const response = await axios.get(`${getContractRoute}/${userId}`);
            const { contract } = response.data.data;
            setContract(contract);
            setRoomNumber(contract.roomNumber);
            console.log(contract.roomNumber, "roomNumber");
        } catch (error) {
            console.error("Error fetching contract:", error);
            setContract(null);
        }
    };

    useEffect(() => {
        handleGetContract();
    }, [userId]);

    useEffect(() => {
        if (roomNumber) {
            getRoomById();
        }
    }, [roomNumber]);



    const getRoomById = async () => {
        try {
            const { data } = await axios.get(`${getRoomByIdRoute}${roomNumber}`);
            setUserInfo(data.data.users);
            setEquipment(data.data.equipment || []);
            console.log(data.data);
        } catch (err) {
            console.error("Error fetching room by ID:", err);
        }
    };

    return (
        <Box className={styles['room-info-container']} p={3}>
            <Typography variant="h4" align="center" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#1976d2' }}>
                Thông Tin Phòng
            </Typography>

            <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)} centered>
                <Tab label="Thông Tin Phòng" />
                <Tab label="Chi Phí Hàng Tháng" />
            </Tabs>

            {tabIndex === 0 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <RoomMembers userInfo={userInfo} />
                    <RoomDetails />
                    <RoomEquipment equipment={equipment} getRoomById={getRoomById} roomNumber={roomNumber} />
                </Grid>
            )}

            {tabIndex === 1 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <MonetizationOn sx={{ marginRight: 1 }} /> Chi Phí Hàng Tháng
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tiền Điện</Typography>
                                    <Typography>{electricityCost.toLocaleString()} VNĐ</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tiền Nước</Typography>
                                    <Typography>{waterCost.toLocaleString()} VNĐ</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tổng Chi Phí</Typography>
                                    <Typography>{totalCost.toLocaleString()} VNĐ</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default RoomInfo;
