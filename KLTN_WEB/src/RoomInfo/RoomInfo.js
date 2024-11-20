import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { MonetizationOn } from '@mui/icons-material';
import axios from 'axios';
import { getContractRoute, getRoomByIdRoute, getBillRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import RoomDetails from './RoomDetail';
import RoomEquipment from './RoomEquipment';
import RoomMembers from './RoomMember';
import styles from './RoomInfo.module.css';

const RoomInfo = () => {
    const { userId } = useUser();
    const [contract, setContract] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [roomNumber, setRoomNumber] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    const [previousReading, setPreviousReading] = useState(0);
    const [currentReading, setCurrentReading] = useState(0);

    const freeWater = 3; // Miễn phí 3 m3 nước
    const freeElectric = 3; // Miễn phí 3 KWh điện
    const waterPrice = 5000; // Giá nước
    const electricPrice = 2500; // Giá điện

    // Tính số điện đã sử dụng và chi phí
    const calculateElectricityCost = (currentReading, previousReading, numUsers) => {
        console.log(currentReading, previousReading, numUsers);
        const usedElectricity = currentReading - previousReading;
        const freeElectricity = freeElectric * numUsers; // Tổng số điện miễn phí cho tất cả người trong phòng
        const exceededElectricity = usedElectricity - freeElectricity;
        const cost = exceededElectricity > 0 ? exceededElectricity * electricPrice : 0;
        return { usedElectricity, cost };
    };

    const handleGetContract = async () => {
        try {
            const response = await axios.get(`${getContractRoute}/${userId}`);
            const { contract } = response.data.data;
            setContract(contract);
            setRoomNumber(contract.roomNumber);
        } catch (error) {
            console.error("Error fetching contract:", error);
            setContract(null);
        }
    };

    const getRoomById = async () => {
        try {
            const { data } = await axios.get(`${getRoomByIdRoute}G201`);
            setUserInfo(data.data.room.users);
            setEquipment(data.data.equipment || []);
            setCurrentReading(data.data.room.electricityNumber); // Số điện tháng này
        } catch (err) {
            console.error("Error fetching room by ID:", err);
        }
    };

    const getBill = async () => {
        try {
            const response = await axios.get(`${getBillRoute}/G201`);
            const bill = response.data.data.find(bill => bill.billType === 'ELECTRIC');
            if (bill) {
                setPreviousReading(bill.currentReading); // Lấy số điện tháng trước
            }
        } catch (err) {
            console.error("Error fetching bill:", err);
        }
    };

    useEffect(() => {
        handleGetContract();
    }, [userId]);

    useEffect(() => {
        if (roomNumber) {
            getRoomById();
            getBill();
        }
    }, [roomNumber]);

    // Tính chi phí điện và số điện đã sử dụng
    const { usedElectricity, cost } = calculateElectricityCost(currentReading, previousReading, userInfo.length);

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
                    <RoomEquipment equipment={equipment} roomNumber={roomNumber} />
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
                                <Grid item xs={6}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Số Điện Đã Sử Dụng</Typography>
                                    <Typography>{usedElectricity.toFixed(2)} KWh</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Chi Phí Điện</Typography>
                                    <Typography>{cost.toLocaleString()} VNĐ</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Lượng nước sử dụng</Typography>
                                    <Typography>0 m3</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tổng Chi Phí</Typography>
                                    <Typography> VNĐ</Typography>
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
