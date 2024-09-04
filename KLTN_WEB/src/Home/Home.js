import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircle';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionOutlinedIcon from '@mui/icons-material/Description';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Home.module.css';
import ImportXLSX from './Import-xlsx/ImportXlxs';
import UserInfo from './UserInfo/UserInfo';
import TotalStudent from './components/TotalStudent';
import RoomInfo from './RoomInfo/RoomInfo';
import AvailableSlot from './AvailableSlot/AvailableSlot';
import Payment from './Pay/Payment';
import BasicModal from './components/BasicModal';
import { Button } from '@mui/material-next';

const Home = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const boxStyle = { padding: 2, backgroundColor: '#f5f5f5', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer', };

    return (
        <div className={style['home-container']}>
            <BasicModal open={open} handleClose={handleClose} />

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...boxStyle, overflow: 'auto', flex: 1 }}>
                        <UserInfo />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ ...boxStyle, overflow: 'hidden', minHeight: '50px', marginBottom: 2, flex: 1 }}>
                        <Typography variant="h6">Quy phạm</Typography>
                        <Typography variant="body2" color="textSecondary">
                            - Quy tắc 1: Không sử dụng điện thoại trong lớp học.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            - Quy tắc 2: Tôn trọng ý kiến của người khác.
                        </Typography>
                    </Box>
                    <Box sx={{ ...boxStyle, minHeight: '50px', flex: 1 }}>
                        <RoomInfo />
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ marginTop: 3 }}>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={handleOpen} >
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AddBusinessIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Đăng ký phòng</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={() => navigate('/room-info')} >
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <InfoOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Thông tin phòng</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={() => navigate('/notification')} >
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <NotificationsActiveOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Thông báo</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={() => navigate('/contract')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <DescriptionOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Hợp đồng</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={() => navigate('/profile')} >
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AccountCircleOutlinedIcon fontSize="medium" />
                        </IconButton>
                        <Typography variant="caption">Thông tin cá nhân</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{ ...boxStyle, height: 100, marginTop: -4 }} onClick={() => navigate('/room')}>
                        <IconButton sx={{ color: '#4da1e8' }}>
                            <AttachMoneyIcon fontSize="medium" /> {/* Hoặc ReceiptIcon */}
                        </IconButton>
                        <Typography variant="caption">Hóa đơn</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={3}   >
                <Grid item xs={12} sm={6} md={4}  >
                    <Box sx={{ marginTop: 2 }}>
                        <TotalStudent />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ marginTop: 2 }}>
                        <AvailableSlot />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ marginTop: 2 }}>
                        <Payment />
                    </Box>
                </Grid>
            </Grid>
        </div >
    );
};

export default Home;
