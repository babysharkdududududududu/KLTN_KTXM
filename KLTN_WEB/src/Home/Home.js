import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircle';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionOutlinedIcon from '@mui/icons-material/Description';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBadge from '../Context/NotificationBadge';
import { useWebSocket } from '../Context/WebSocketContext';
import AvailableSlot from './AvailableSlot/AvailableSlot';
import GavelIcon from '@mui/icons-material/Gavel';
import iuh from '../Payment/asset/iuh.png';


import { useUser } from '../Context/Context';
import style from './Home.module.css';
import Payment from './Pay/Payment';
import RoomInfo from './RoomInfo/RoomInfo';
import UserInfo from './UserInfo/UserInfo';
import TotalStudent from './components/TotalStudent';
import Discipline from './Discipline/Discipline';

const Home = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const { numberNoti } = useWebSocket();
    const [prevNoti, setPrevNoti] = useState(numberNoti);
    const [isShaking, setIsShaking] = useState(false);
    const { updateNotificationCount } = useWebSocket();
    const { userId, roleId } = useUser();

    useEffect(() => {
        if (numberNoti > prevNoti) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 10000);
            return () => clearTimeout(timer);
        }
        setPrevNoti(numberNoti);
    }, [numberNoti, prevNoti]);

    const handleClick = () => {
        navigate('/success');
        updateNotificationCount(0);
    };

    const boxStyle = { padding: 2, backgroundColor: '#f5f5f5', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', };

    return (
        <div className={style['home-container']}>
            <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ marginBottom: '20px' }}>
                <Grid item xs={12}>
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#f5f5f5", borderRadius: '8px', minHeight: { xs: '30px', sm: '30px' }, padding: { xs: 1, sm: 3 }, }}>
                        <Box component="img" src={iuh} alt="iuh" sx={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', height: { xs: '30px', sm: '70px' }, marginRight: '10px', }} />
                        <Typography variant="h6" sx={{ color: '#4da1e8', fontSize: { xs: '16px', sm: '20px' }, textAlign: 'center', marginLeft: { xs: '60px', sm: '0px' }, }}>
                            Hệ thống quản lý ký túc xá
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...boxStyle, overflow: 'auto', flex: 1 }}>
                        <UserInfo />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...boxStyle, overflow: 'hidden', minHeight: '100px', marginBottom: 2, flex: 1, }}>
                        <Discipline />
                    </Box>
                    <Box sx={{ ...boxStyle, minHeight: '50px', flex: 1, marginTop: '-10px' }}>
                        <RoomInfo />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '0px' }} >
                <Grid item xs={6} sm={4} md={2}>
                    <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/approve-room')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AddBusinessIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Đăng ký phòng</Typography>
                    </Box>
                </Grid>
                {
                    roleId === 'MANAGER' ? (
                        <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ ...boxStyle, height: 100 }} onClick={() => navigate('/discipline')}>
                                <IconButton sx={{ color: '#4da1e8' }}>
                                    <GavelIcon fontSize="medium" />
                                </IconButton>
                                <Typography variant="caption">Quản lý quy phạm</Typography>
                            </Box>
                        </Grid>
                    ) :
                        <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/room-info')}>
                                <IconButton sx={{ color: '#4da1e8' }}>
                                    <InfoOutlinedIcon fontSize="medium" />
                                </IconButton>
                                <Typography variant="caption">Thông tin phòng</Typography>
                            </Box>
                        </Grid>
                }
                <Grid item xs={6} sm={4} md={2}>
                    <Box sx={{ ...boxStyle, height: 100, position: 'relative' }} onClick={handleClick}>
                        <IconButton sx={{ color: '#4da1e8' }} className={isShaking ? style['shake-icon'] : ''}>
                            <NotificationsActiveOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <NotificationBadge position={{ top: '40px', right: '75px' }} style={{ fontSize: '8px', padding: '1px 4px' }} />
                        <Typography variant="caption">Thông báo</Typography>
                    </Box>
                </Grid>
                {
                    roleId === 'MANAGER' ? (
                        <Grid item xs={6} sm={4} md={2}>
                            <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/maintenance')}>
                                <IconButton sx={{ color: '#4da1e8' }}>
                                    <DescriptionOutlinedIcon fontSize="medium" />
                                </IconButton>
                                <Typography variant="caption">Bảo trì</Typography>
                            </Box>
                        </Grid>
                    ) :
                        (
                            <Grid item xs={6} sm={4} md={2}>
                                <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/contract')}>
                                    <IconButton sx={{ color: '#4da1e8' }}>
                                        <DescriptionOutlinedIcon fontSize="medium" />
                                    </IconButton>
                                    <Typography variant="caption">Hợp đồng</Typography>
                                </Box>
                            </Grid>
                        )
                }
                <Grid item xs={6} sm={4} md={2}>
                    <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/profile')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AccountCircleOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Thông tin cá nhân</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/room')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AttachMoneyIcon fontSize="medium" /> {/* Hoặc ReceiptIcon */}
                        </IconButton>
                        <Typography variant="caption">Hóa đơn</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={{ xs: 0, sm: 2 }}>
                <Grid item xs={12} sm={6} md={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Box sx={{ marginTop: 2 }}>
                        <TotalStudent />
                    </Box>
                </Grid>
                {/* <Grid item xs={6} sm={12} md={4}>
                    <Box sx={{ marginTop: { xs: 2, sm: 2 }, marginRight: { xs: 0 }, maxWidth: '100%', }}>
                        <AvailableSlot />
                    </Box>
                </Grid>
                <Grid item xs={6} sm={12} md={4}>
                    <Box sx={{ marginTop: { xs: 2, sm: 2 }, maxWidth: '100%', }}>
                        <Payment />
                    </Box>
                </Grid> */}

                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ marginTop: 2 }}>
                        <AvailableSlot />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '50px' }}>
                    <Box sx={{ marginTop: 2 }}>
                        <Payment />
                    </Box>
                </Grid>
            </Grid>
        </div >
    );
};

export default Home;
