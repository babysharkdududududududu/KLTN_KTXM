import AddIcon from '@mui/icons-material/Add';
import BackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createNotificationRoute, deleteNotificationRoute, getNotificationRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import { useWebSocket } from '../Context/WebSocketContext';


const Notification = () => {
    const { sendMessage, messages } = useWebSocket();

    const [notifications, setNotifications] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [typeFilter, setTypeFilter] = useState(['Bảo trì, sửa chữa', 'Tài chính', 'Nội quy, quy định', 'Hoạt động, sự kiện', 'An ninh, trật tự']);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: ''
    });
    const { roleId } = useUser();

    const handleOpenModal = () => {
        setVisibleModal(true);
        console.log('Role ID:', roleId);

    }

    const handleCloseModal = () => {
        setVisibleModal(false);
        setNewNotification({ title: '', message: '', type: '' });
    }

    const handleChange = (e) => {
        setNewNotification({
            ...newNotification,
            [e.target.name]: e.target.value
        });
    }

    const handleSave = async () => {
        try {
            const response = await axios.post(createNotificationRoute, newNotification);
            console.log('Create Notification Response:', response);
            fetchNotifications();
            handleCloseModal();
            sendMessage(newNotification);
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    }

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(getNotificationRoute);
            const notificationResults = response.data.data.results;
            setNotifications(notificationResults);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${deleteNotificationRoute}/${id}`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = selectedFilter
        ? notifications.filter(notification => notification.type === selectedFilter)
        : notifications;

    const handleViewDetails = (notification) => {
        setSelectedNotification(notification);
    }

    const handleCloseDetails = () => {
        setSelectedNotification(null);
    }
    const handleBack = () => {
        window.history.back();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: 4 }}>
            {/* Icon back */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2, cursor: 'pointer', display: { xs: 'flex', md: 'none', } }}>
                <Avatar sx={{ backgroundColor: '#1976d2' }} onClick={handleBack}>
                    <BackIcon />
                </Avatar>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 4, padding: 2, }}>
                <Button variant={!selectedFilter ? 'contained' : 'outlined'} color="primary" onClick={() => setSelectedFilter('')}
                    sx={{ flex: '1 1 30%', minWidth: '120px', marginBottom: { xs: 1, sm: 1 }, marginRight: '10px', fontSize: { xs: 8, sm: 15 } }}>
                    Tất cả
                </Button>
                {typeFilter.map((type, index) => (
                    <Button key={index} variant={selectedFilter === type ? 'contained' : 'outlined'} color="primary" onClick={() => setSelectedFilter(type)}
                        sx={{ flex: '1 1 30%', minWidth: '100px', marginBottom: { xs: 1, sm: 1 }, marginRight: '10px', fontSize: { xs: 8, sm: 15 } }}>
                        {type}
                    </Button>
                ))}
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <List>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <Card key={notification._id} variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, }}>
                                    {/* Date Section */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 0, marginRight: { xs: 0, sm: 5 }, }}>
                                        <div style={{ backgroundColor: '#005ab7', color: 'white', padding: '5px', textAlign: 'center', width: '100px' }}>
                                            <Typography variant="h6" style={{ margin: 0 }}>
                                                {`${new Date(notification.sentAt).getMonth() + 1}/${new Date(notification.sentAt).getFullYear()}`}
                                            </Typography>
                                        </div>
                                        <Typography variant="h4" style={{ color: '#005ab7', fontWeight: 'bold', marginTop: '8px' }}>
                                            {new Date(notification.sentAt).getDate()}
                                        </Typography>
                                    </Box>

                                    {/* Notification Details */}
                                    <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                                        <Typography variant="h6" component="h3" gutterBottom>{notification.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>{notification.message.slice(0, 50)}...</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(notification.sentAt).toLocaleString()} - {notification.type}</Typography>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                        <Button onClick={() => handleViewDetails(notification)} color="primary">Xem chi tiết</Button>
                                        <Button onClick={() => handleDelete(notification._id)} color="secondary">Xóa</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" align="center" mt={3}>Không có thông báo nào.</Typography>
                    )}
                </List>
            </Box>


            {
                roleId === 'USERS' ? null : (
                    <IconButton onClick={handleOpenModal} color="primary" sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', backgroundColor: '#1976d2', }}>
                        <AddIcon sx={{ color: "white", fontSize: 30, fontWeight: 'bold' }} />
                    </IconButton>
                )
            }
            {/* <IconButton onClick={handleOpenModal} color="primary" sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', backgroundColor: '#1976d2', }}>
                <AddIcon sx={{ color: "white", fontSize: 30, fontWeight: 'bold' }} />
            </IconButton> */}

            <Dialog open={visibleModal} onClose={handleCloseModal} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
                <DialogTitle>Thêm Thông Báo Mới</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="title" label="Tiêu đề" type="text" fullWidth variant="outlined" value={newNotification.title} onChange={handleChange} />
                    <TextField margin="dense" name="message" label="Nội dung" type="text" fullWidth variant="outlined" value={newNotification.message} onChange={handleChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Loại</InputLabel>
                        <Select name="type" value={newNotification.type} onChange={handleChange} variant="outlined">
                            {typeFilter.map((type, index) => (
                                <MenuItem key={index} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Chi tiết thông báo */}
            <Dialog open={!!selectedNotification} onClose={handleCloseDetails} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
                <DialogTitle>{selectedNotification?.title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{selectedNotification?.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(selectedNotification?.sentAt).toLocaleString()} - {selectedNotification?.type}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Notification;
