import React, { useState } from 'react';
import { Typography, Box, Paper, Grid, Tabs, Tab, Divider } from '@mui/material';
import { People, MonetizationOn, Water, Bed } from '@mui/icons-material';
import styles from './RoomInfo.module.css';

const RoomInfo = () => {
    // Dữ liệu giả lập
    const members = [
        { name: 'Nguyễn Văn A', role: 'Chủ phòng' },
        { name: 'Trần Thị B', role: 'Thành viên' },
        { name: 'Lê Văn C', role: 'Thành viên' },
        { name: 'Lê Văn D', role: 'Thành viên' },
        { name: 'Lê Văn E', role: 'Thành viên' },
        { name: 'Lê Văn F', role: 'Thành viên' },
        { name: 'Lê Văn G', role: 'Thành viên' },
        { name: 'Lê Văn H', role: 'Thành viên' },
        { name: 'Lê Văn I', role: 'Thành viên' },
    ];

    const initialEquipmentStatus = [
        { name: 'Giường', status: 'Có sẵn', number: 8 },
        { name: 'Đèn', status: 'Hoạt động', number: 4 },
        { name: 'Quạt', status: 'Hoạt động', number: 2 },
    ];

    const [equipmentStatus, setEquipmentStatus] = useState(initialEquipmentStatus);
    const [tabIndex, setTabIndex] = useState(0);

    // Hàm cập nhật trạng thái thiết bị
    const toggleEquipmentStatus = (index) => {
        setEquipmentStatus((prevStatus) =>
            prevStatus.map((equipment, i) =>
                i === index
                    ? { ...equipment, status: equipment.status === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động' }
                    : equipment
            )
        );
    };

    // Chi phí điện và nước với giá khác nhau cho mỗi tháng
    const monthlyCosts = {
        electricity: [
            120000, 140000, 130000, 160000, 150000, 170000,
            180000, 190000, 200000, 210000, 220000, 240000,
        ],
        water: [
            50000, 60000, 55000, 70000, 75000, 80000,
            90000, 85000, 95000, 100000, 105000, 110000,
        ],
    };

    // Tính tổng chi phí hàng tháng cho từng tháng
    const totalMonthlyCosts = monthlyCosts.electricity.map((cost, index) => {
        return cost + monthlyCosts.water[index];
    });

    return (
        <Box className={styles['room-info-container']} p={3}>
            <Typography variant="h4" align="center" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#1976d2' }}>
                Thông Tin Phòng
            </Typography>

            {/* Tabs */}
            <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)} centered>
                <Tab label="Thông Tin Phòng" />
                <Tab label="Tổng Chi Phí" />
            </Tabs>

            {tabIndex === 0 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {/* Danh Sách Thành Viên */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <People sx={{ marginRight: 1 }} /> Danh Sách Thành Viên
                            </Typography>
                            <Grid container spacing={2}>
                                {members.map((member, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Paper elevation={1} sx={{ padding: 1, marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Thông Tin Về Phòng Ở */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, marginTop: 0, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ color: '#1976d2', marginBottom: 1 }}>Thông Tin Về Phòng Ở</Typography>
                            <Box paddingY={1}>
                                <Typography>
                                    Mỗi phòng có 8 giường tầng, sức chứa tối đa 16 người và được trang bị đầy đủ các tiện nghi như quạt, đèn và máy giặt.
                                </Typography>
                                <Typography>
                                    Miễn phí 48kWh điện mỗi tháng, tính phí 2.500 đồng/kWh sau đó.
                                </Typography>
                                <Typography>
                                    Miễn phí 3 m³ nước đầu tiên mỗi tháng, tính phí 5.000 đồng/m³ từ tháng tiếp theo.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Thông Tin Trang Thiết Bị */}
                    <Grid item xs={12} sx={{ marginTop: 0 }}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <Bed sx={{ marginRight: 1 }} /> Trang Thiết Bị Trong Phòng
                            </Typography>
                            <Grid container spacing={2}>
                                {equipmentStatus.map((equipment, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Paper
                                            elevation={1}
                                            sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, cursor: 'pointer', backgroundColor: equipment.status === 'Hoạt động' ? '#e8f5e9' : '#ffebee' }}
                                            onClick={() => toggleEquipmentStatus(index)}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{equipment.name} ({equipment.number})</Typography>
                                            <Typography variant="body2" color={equipment.status === 'Hoạt động' ? 'green' : 'red'}>
                                                {equipment.status}
                                            </Typography>
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
                                <MonetizationOn sx={{ marginRight: 1 }} /> Chi Phí Hàng Tháng Trong 12 Tháng
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tiền Điện</Typography>
                                </Grid>
                                {monthlyCosts.electricity.map((cost, index) => (
                                    <Grid item xs={2} key={index}>
                                        <Paper elevation={1} sx={{ padding: 1, textAlign: 'center', borderRadius: 1 }}>
                                            <Typography>Tháng {index + 1}: {cost.toLocaleString()} VNĐ</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ marginBottom: 1 }}>Tiền Nước</Typography>
                                </Grid>
                                {monthlyCosts.water.map((cost, index) => (
                                    <Grid item xs={2} key={index}>
                                        <Paper elevation={1} sx={{ padding: 1, textAlign: 'center', borderRadius: 1 }}>
                                            <Typography>Tháng {index + 1}: {cost.toLocaleString()} VNĐ</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, marginTop: 2 }}>
                            <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                                <MonetizationOn sx={{ marginRight: 1 }} /> Tổng Chi Phí Hàng Tháng
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={3}>
                                {totalMonthlyCosts.map((totalCost, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Paper elevation={1} sx={{ padding: 1.5, textAlign: 'center', borderRadius: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Tháng {index + 1}</Typography>
                                            <Typography variant="body2" sx={{ color: '#1976d2' }}>{totalCost.toLocaleString()} VNĐ</Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default RoomInfo;
