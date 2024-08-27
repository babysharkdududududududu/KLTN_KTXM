import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid, Tabs, Tab, Divider, Button } from '@mui/material';
import { People, MonetizationOn, Water, Bed } from '@mui/icons-material';
import styles from './RoomInfo.module.css';
import { useUser } from "../Context/Context";
import axios from 'axios';
import { getContractRoute, getRoomByIdRoute } from '../API/APIRouter';

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
            <Button variant="contained" color="primary" onClick={getRoomById}>Lấy thông tin hợp đồng</Button>

            <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)} centered>
                <Tab label="Thông Tin Phòng" />
                <Tab label="Chi Phí Hàng Tháng" />
            </Tabs>

            {tabIndex === 0 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <People sx={{ marginRight: 1 }} /> Danh Sách Thành Viên
                            </Typography>
                            <Grid container spacing={2}>
                                {userInfo.map((user, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                                            <Typography variant="body2" sx={{ color: '#1976d2' }}>{user.userId}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, marginTop: 0, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: '#1976d2', marginBottom: 1 }}>Thông Tin Về Phòng Ở</Typography>
                            <Box paddingY={1}>
                                <Typography>
                                    Mỗi phòng có 8 giường tầng, sức chứa tối đa 16 người và được trang bị đầy đủ các tiện nghi như quạt, đèn và máy giặt.
                                </Typography>
                                <Typography>
                                    Miễn phí 48kWh điện mỗi tháng, tính phí 3.000 đồng/kWh sau đó.
                                </Typography>
                                <Typography>
                                    Miễn phí 3 m³ nước đầu tiên mỗi tháng, tính phí 5.000 đồng/m³ từ tháng tiếp theo.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sx={{ marginTop: 0 }}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <Bed sx={{ marginRight: 1 }} /> Trang Thiết Bị Trong Phòng
                            </Typography>
                            <Grid container spacing={2}>
                                {equipment.map((item, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Paper
                                            elevation={1}
                                            sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.name} ({item.quantity})</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
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
