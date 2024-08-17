import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HouseIcon from '@mui/icons-material/House';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./MainMenu.css";
import avt from "./asset/avt.jpg";
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MainMenu = ({ onLogout }) => {
  const [menuItem1, setMenuItem1] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  const handleGoToSetting = () => {
    navigate('/settings');
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

  return (
    <div>
      <div className={`main-menu-container ${menuOpen ? 'open' : 'closed'}`}>
        <div className="menu-bulge" onClick={toggleMenu}>
          <IconButton>
            {menuOpen ? <ChevronLeftIcon className="menu-toggle-icon" /> : <ChevronRightIcon className="menu-toggle-icon" />}
          </IconButton>
        </div>
        {menuOpen && (
          <div className="menu-content">
            <Tooltip title="User">
              <IconButton onClick={handleOpenMenu1}>
                <AccountCircleIcon className="menu-icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Home">
              <IconButton onClick={() => navigate('/')}>
                <HouseIcon className="menu-icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Thống kê">
              <IconButton onClick={() => navigate('/statistical')}>
                <BarChartIcon className="menu-icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cài đặt">
              <IconButton onClick={handleGoToSetting}>
                <SettingsIcon className="menu-icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Đăng xuất" onClick={handleLogout}>
              <IconButton>
                <ExitToAppIcon className="menu-icon" />
              </IconButton>
            </Tooltip>
          </div>
        )}

        <Menu className="basic-menu" anchorEl={menuItem1} open={Boolean(menuItem1)} onClose={handleCloseMenu}>
          <List>
            <ListItem>
              <Avatar alt="User Avatar" src={avt} sx={{ width: 56, height: 56 }} />
              <span style={{ marginLeft: '10px' }}>User Name</span>
            </ListItem>
            <Divider />
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
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
    </div>
  );
};

export default MainMenu;
