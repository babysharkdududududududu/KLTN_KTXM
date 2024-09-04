import React, { useEffect, useState } from 'react';
import { useUser } from '../../Context/Context';
import { getUserByIdRoute } from '../../API/APIRouter';
import axios from 'axios';
import { Container, Typography, Avatar, Paper, CircularProgress, Grid, Box, Divider } from '@mui/material';

const UserInfo = () => {
    const { userId } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGetUserInfo = async (userId) => {
        try {
            const response = await axios.get(`${getUserByIdRoute}${userId}`);
            setUserInfo(response.data.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetUserInfo(userId);
    }, [userId]);

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                userInfo && (
                    <Box elevation={3} sx={{ padding: 2, borderRadius: 2, maxWidth: 800, minHeight: 150, background: '#f5f5f5' }}>
                        <Typography gutterBottom sx={{ fontFamily: 'Tahoma', textAlign: 'center', fontSize: 16 }}>
                            Thông tin cá nhân
                        </Typography>
                        <Divider />
                        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
                            <Grid item xs={12} sm={4} md={4} container justifyContent="center">
                                <Avatar src={userInfo.image} alt="User Avatar" sx={{ width: 100, height: 100, border: '3px solid #3f51b5', boxShadow: 3 }} />
                            </Grid>
                            <Grid item xs={12} sm={8} md={8}>
                                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Tahoma', fontSize: 20, textAlign: 'center' }}>
                                    <strong>{userInfo.name}</strong>
                                </Typography>
                                <Grid container spacing={10}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                MSSV: <strong>{userInfo.userId || 'Chưa có MSSV'}</strong>
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                Số điện thoại: <strong>{userInfo.phone || 'Chưa có số điện thoại'}</strong>
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                Giới tính: <strong>{userInfo.gender || 'Chưa có giới tính'}</strong>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                Năm sinh: <strong>{userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).getFullYear() : 'Chưa có năm sinh'}</strong>
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                Email: <strong>{userInfo.email || 'Chưa có email'}</strong>
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Tahoma', fontSize: 12 }}>
                                                Địa chỉ: <strong>{userInfo.address || 'Chưa có địa chỉ'}</strong>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )
            )}
        </Container>
    );
};

export default UserInfo;
