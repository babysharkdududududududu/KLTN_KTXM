import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircle';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionOutlinedIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActive';
import { Container, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBadge from '../Context/NotificationBadge';
import { useWebSocket } from '../Context/WebSocketContext';
import iuh from '../Payment/asset/iuh.png';
import helloAnimation from './asset/hello.json';
import AvailableSlot from './AvailableSlot/AvailableSlot';
import CreateUser from './CreateUser/CreateUser';
import ManagementImport from './Import/ManagementImport';

import { ReactTyped } from 'react-typed';
import { useUser } from '../Context/Context';
import TotalStudent from './components/TotalStudent';
import Discipline from './Discipline/Discipline';
import style from './Home.module.css';
import Payment from './Pay/Payment';
import RoomInfo from './RoomInfo/RoomInfo';
import UserInfo from './UserInfo/UserInfo';
import { getSettingIdRoute } from '../API/APIRouter';
import Snowfall from 'react-snowfall';

const Home = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const { numberNoti } = useWebSocket();
    const [prevNoti, setPrevNoti] = useState(numberNoti);
    const [isShaking, setIsShaking] = useState(false);
    const { updateNotificationCount } = useWebSocket();
    const { userId, roleId } = useUser();
    const [submitIsOpen, setSubmitIsOpen] = useState(false);

    useEffect(() => {
        if (numberNoti > prevNoti) {
            setIsShaking(true);
            const timer = setTimeout(() => setIsShaking(false), 10000);
            return () => clearTimeout(timer);
        }
        setPrevNoti(numberNoti);
    }, [numberNoti, prevNoti]);
    const handleClick = () => {
        navigate('/notification');
        updateNotificationCount(0);
    };

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const response = await fetch(getSettingIdRoute);
                const data = await response.json();
                setSubmitIsOpen(data.data);
            } catch (error) {
                console.error('Failed to fetch setting: ', error);
            }
        };
        fetchSetting();
    }, []);

    const boxStyle = { padding: 2, backgroundColor: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', };

    return (
        <Container className={style['home-container']}>
            <Snowfall />

            <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ marginBottom: '10px' }}>
                <Grid item xs={12}>
                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: "#fff", borderRadius: '8px', maxHeight: { xs: '30px', sm: '30px' }, padding: { xs: 1, sm: 3 }, }}>
                        <Box component="img" src={iuh} alt="iuh" sx={{ flex: 1, position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', height: { xs: '30px', sm: '70px' }, marginRight: '10px', }} />
                        <Typography variant="caption" sx={{ color: '#4da1e8', fontSize: { xs: '10px', sm: '20px' }, textAlign: 'center', flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.2em', background: 'linear-gradient(90deg, #4da1e8, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginLeft: { xs: '40px', sm: '0px' }, padding: '10px 20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', }}>
                            <ReactTyped
                                strings={['Hệ thống quản lý ký túc xá ']}
                                typeSpeed={100}
                                backSpeed={50}
                                loop={true}
                                cursor={'|'}
                                showCursor={true}
                                fadeIn={true}
                                backDelay={10000}
                                startDelay={500}
                            />
                        </Typography>
                        <Lottie sx={{ flex: 1, }} animationData={helloAnimation} loop={true} style={{ width: '130px', height: '100px', textAlign: 'center', alignSelf: 'center', marginTop: '10px' }} />
                    </Box>
                </Grid>
            </Grid>


            <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...boxStyle, overflow: 'auto', flex: 1 }}>
                        <UserInfo />
                    </Box>
                </Grid>
                {
                    roleId === 'MANAGER' ? (
                        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column' }} onClick={() => navigate('/management-import')} >
                            <Box sx={{ ...boxStyle, overflow: 'auto', flex: 1 }}>
                                <ManagementImport />
                            </Box>
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ ...boxStyle, overflow: 'hidden', minHeight: '100px', marginBottom: 2, flex: 1, }}>
                                <Discipline />
                            </Box>
                            <Box sx={{ ...boxStyle, minHeight: '50px', flex: 1, marginTop: '-10px' }}>
                                <RoomInfo />
                            </Box>
                        </Grid>
                    )
                }

            </Grid>

            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '0px' }} >
                <Grid item xs={6} sm={4} md={2}>
                    <Box
                        sx={{
                            ...boxStyle,
                            height: 100,
                            cursor: (submitIsOpen || roleId === 'MANAGER') ? 'pointer' : 'not-allowed', // Thay đổi con trỏ chuột
                            opacity: (submitIsOpen || roleId === 'MANAGER') ? 1 : 0.5, // Làm mờ nếu không khả dụng
                        }}
                        onClick={(submitIsOpen || roleId === 'MANAGER') ? () => navigate('/approve-room') : undefined} // Không có hành động nếu không khả dụng
                    >
                        <IconButton sx={{ color: (submitIsOpen || roleId === 'MANAGER') ? '#4da1e8' : '#ccc' }} disabled={!submitIsOpen && roleId !== 'MANAGER'}>
                            <AddBusinessIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">
                            {submitIsOpen ? 'Đăng ký phòng' : (roleId === 'MANAGER' ? 'Đăng ký phòng' : 'Chưa mở đăng ký')}
                        </Typography>
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
                    <Box sx={{ ...boxStyle, height: 100, }} onClick={() => navigate('/dorm-bill')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AttachMoneyIcon fontSize="medium" /> {/* Hoặc ReceiptIcon */}
                        </IconButton>
                        <Typography variant="caption">Hóa đơn</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} >
                    <Box sx={{ marginTop: 2 }}>
                        <TotalStudent />
                    </Box>
                </Grid>
                {
                    roleId === 'MANAGER' ? (
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ marginTop: 2 }}>
                                <CreateUser />
                            </Box>
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ marginTop: 2 }}>
                                <AvailableSlot />
                            </Box>
                        </Grid>

                    )
                }

                <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '50px' }}>
                    <Box sx={{ marginTop: 2 }}>
                        <Payment />
                    </Box>
                </Grid>
            </Grid>
        </Container >
    );
};

export default Home;
