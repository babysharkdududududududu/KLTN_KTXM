import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DownloadIcon from '@mui/icons-material/Download';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings'; // Thêm import cho SettingsIcon

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

export default function CustomizedMenus({
    roleId,
    setingID,
    registrationStatus,
    statusID,
    handleOpenPauseDialog,
    handleOpenOpenDialog,
    handleOpenAutoAssignDialog,
    handleOpenPaymentDialog,
    handleExportData,
    handleOpen, // Thêm hàm callback cho Cài đặt
    handleOpenClosePaymentDialog, 
    statusPayment
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    console.log('statusPayment', statusPayment);

    // Tạo mảng các mục menu
    const menuItems = [];

    if (roleId === 'MANAGER' && setingID !== '') {
        if (registrationStatus === 'open') {
            menuItems.push(
                <MenuItem key="pause" onClick={handleOpenPauseDialog} disableRipple>
                    <PauseIcon /> Tạm dừng đăng ký
                </MenuItem>
            );
        }
        if (registrationStatus === 'paused') {
            menuItems.push(
                <MenuItem key="open" onClick={handleOpenOpenDialog} disableRipple>
                    <PlayArrowIcon /> Mở đăng ký
                </MenuItem>
            );
        }
        if (statusID === 'PAID') {
            menuItems.push(
                <MenuItem key="auto-assign" onClick={handleOpenAutoAssignDialog} disableRipple>
                    <AutoAwesomeIcon /> Tự động xếp phòng
                </MenuItem>
            );
        }
        if (statusID === 'ACCEPTED' && statusPayment === false) {
            menuItems.push(
                <MenuItem key="payment" onClick={handleOpenPaymentDialog} disableRipple>
                    <PaymentIcon /> Mở thanh toán
                </MenuItem>
            );
        }
        if (statusID === 'ACCEPTED' && statusPayment === true) {
            menuItems.push(
                <MenuItem key="pause-payment" onClick={handleOpenClosePaymentDialog} disableRipple>
                    <PauseIcon /> Tạm dừng thanh toán
                </MenuItem>
            );
        }
        // Xuất dữ liệu
        menuItems.push(
            <MenuItem key="export" onClick={handleExportData} disableRipple>
                <DownloadIcon /> Xuất dữ liệu
            </MenuItem>
        );
        // Thêm Divider
        menuItems.push(<Divider key="divider" sx={{ my: 0.5 }} />);
    }
    // Thêm mục Cài đặt
    menuItems.push(
        <MenuItem key="settings" onClick={handleOpen} disableRipple>
            <SettingsIcon /> Cài đặt
        </MenuItem>
    );

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                Chức năng khác
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {menuItems}
            </StyledMenu>
        </div>
    );
}
