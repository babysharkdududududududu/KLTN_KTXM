import React from 'react';
import { Typography, Grid, Paper, Avatar, Box, Badge } from '@mui/material';
import { People, Cake } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import birthday from './asset/birtday.json';

const RoomMembers = ({ userInfo }) => {
    // Hàm kiểm tra xem ngày sinh có trùng với ngày hiện tại không
    const isTodayBirthday = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    };

    return (
        <Grid item xs={12}>
            <Box sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="h5" display="flex" alignItems="center" sx={{ color: '#3f51b5', marginBottom: 2 }}>
                    <People sx={{ marginRight: 1 }} /> Danh Sách Thành Viên
                </Typography>
                <Grid container spacing={2}>
                    {userInfo.map((user, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                whileHover={{ scale: 1.05, backgroundColor: '#e3f2fd', boxShadow: '0px 8px 16px rgba(0,0,0,0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper sx={{ padding: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                                    <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
                                        <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                            <Avatar src={user.image} alt={user.name} sx={{ width: 100, height: 100, border: '3px solid #3f51b5', boxShadow: 3, marginBottom: 1 }} />
                                        </Badge>
                                    </motion.div>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>{user.name}</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
                                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : 'Chưa có ngày sinh'}
                                    </Typography>
                                    {isTodayBirthday(user.dateOfBirth) && (
                                        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                                            <Lottie animationData={birthday} loop={true} style={{ width: '100px', height: '100px', textAlign: 'center' }} />
                                        </Box>
                                    )}
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Grid>
    );
};

export default RoomMembers;
