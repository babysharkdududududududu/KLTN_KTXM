import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsertChartOutlinedRoundedIcon from '@mui/icons-material/InsertChartOutlinedRounded';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getUserByIdRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import "./MainMenu.css";
import avt from "./asset/avt.jpg";
import logo from "./asset/iuh.png";
import NotificationBadge from '../Context/NotificationBadge';
import { useWebSocket } from '../Context/WebSocketContext';
const MainMenu = ({ onLogout }) => {
  const [menuItem1, setMenuItem1] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const { numberNoti } = useWebSocket();
  const [prevNoti, setPrevNoti] = useState(numberNoti);
  const [isShaking, setIsShaking] = useState(false);
  const { updateNotificationCount } = useWebSocket();
  const { userId, roleId } = useUser();

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/notification');
    updateNotificationCount(0);
  };


  const handleOpenMenu1 = event => {
    setMenuItem1(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuItem1(null);
  };

  const handleLogout = () => {
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmLogout = () => {
    onLogout();
    setSnackbarOpen(true);
    setDialogOpen(false);
    navigate('/');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // API get user info
  const [userName, setUserName] = useState('');
  const getUserInfo = async () => {
    try {
      const rs = await axios.get(`${getUserByIdRoute}${userId}`);
      setUserName(rs.data.data.name);
    }
    catch (err) {
      console.log(err);
    }
  }

  getUserInfo();

  return (
    <div>
      <div className={`main-menu-container ${menuOpen ? 'open' : 'closed'}`}>
        {/* <div className="menu-bulge" onClick={toggleMenu}>
          <IconButton>
            {menuOpen ? <ChevronLeftIcon className="menu-toggle-icon" /> : <ChevronRightIcon className="menu-toggle-icon" />}
          </IconButton>
        </div> */}
        {menuOpen && (
          <div className="menu-content">
            <img src={logo} alt="User Avatar" className="logo-iuh" />
            <div className='action-management'>
              <Tooltip title="Trang chủ">
                <IconButton onClick={() => navigate('/')}>
                  <HomeOutlinedIcon className="menu-icon" />
                </IconButton>
              </Tooltip>
              {
                roleId === 'MANAGER' && (
                  <>
                    <div className='border-line' />
                    <Tooltip title="Thống kê">
                      <IconButton onClick={() => navigate('/statistical')}>
                        <InsertChartOutlinedRoundedIcon className="menu-icon" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
              }
              <div className='border-line' />
              <Tooltip title="Thông báo">
                <div style={{ position: 'relative' }}>
                  <IconButton onClick={handleClick}>
                    <NotificationsOutlinedIcon className="menu-icon" />
                  </IconButton>
                  <NotificationBadge position={{ top: '0', right: '0' }} />
                </div>
              </Tooltip>
              {
                roleId === 'MANAGER' && (
                  <>
                    <div className='border-line' />
                    <Tooltip title="Phòng">
                      <IconButton onClick={() => navigate('/room')}>
                        <BusinessOutlinedIcon className="menu-icon" />
                      </IconButton>
                    </Tooltip>

                    <div className='border-line' />
                    <Tooltip title="Trang thiết bị">
                      <IconButton onClick={() => navigate('/equipment')}>
                        <BedroomChildOutlinedIcon className="menu-icon" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              {
                roleId === 'MANAGER' && (
                  <>
                    <div className='border-line' />
                    <Tooltip title="Thông tin bảo trì">
                      <IconButton onClick={() => navigate('/maintenance')}>
                        <BuildOutlinedIcon className="menu-icon" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
              }
              {
                roleId === 'USERS' && (
                  <>
                    <div className='border-line' />
                    <Tooltip title="Hợp đồng">
                      <IconButton onClick={() => navigate('/contract')}>
                        <AssignmentOutlinedIcon className="menu-icon" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
              }

            </div>

            <div className='action-of-user'>
              <Tooltip title="Cài đặt">
                <IconButton onClick={() => navigate('/settings')}>
                  <SettingsOutlinedIcon className="menu-icon" />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Đăng xuất" onClick={handleLogout}>
              <IconButton>
                <ExitToAppIcon className="menu-icon" />
              </IconButton>
            </Tooltip> */}
              <Tooltip title="User">
                <IconButton onClick={handleOpenMenu1}>
                  <AccountCircleIcon className="menu-icon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}

        <Menu className="basic-menu" anchorEl={menuItem1} open={Boolean(menuItem1)} onClose={handleCloseMenu}>
          <List>
            <ListItem>
              <Avatar alt="User Avatar" src={avt} sx={{ width: 56, height: 56 }} />
              <span style={{ marginLeft: '10px' }}>{userName}</span>
            </ListItem>
            <Divider />
            <MenuItem onClick={() => navigate('/profile')}>Thông tin tài khoản</MenuItem>
            <MenuItem onClick={() => navigate('/room-info')}>Thông tin phòng</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Hóa đơn</MenuItem>

            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon style={{ marginRight: '10px' }} />
              Đăng xuất
            </MenuItem>
          </List>
        </Menu>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message="Đã đăng xuất" />
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Xác nhận đăng xuất</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn đăng xuất không?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">Hủy</Button>
            <Button onClick={handleConfirmLogout} color="primary">Đăng xuất</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div >
  );
};

export default MainMenu;
