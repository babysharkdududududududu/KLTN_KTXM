import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotificationRoute, createNotificationRoute } from '../API/APIRouter';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add'; // Import biểu tượng dấu cộng

import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: ''
    });

    const handleOpenModal = () => {
        setVisibleModal(true);
    }

    const handleCloseModal = () => {
        setVisibleModal(false);
        setNewNotification({ title: '', message: '', type: '' }); // Reset form
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

            // Làm mới danh sách thông báo sau khi tạo thành công
            fetchNotifications();
            handleCloseModal(); // Đóng modal sau khi lưu
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

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: 5 }}>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>Notifications</Typography>
                <List>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <React.Fragment key={notification._id}>
                                <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                            <NotificationsIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" component="h3" gutterBottom>{notification.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>{notification.message}</Typography>
                                            <Typography variant="caption" color="text.secondary">{new Date(notification.sentAt).toLocaleString()} - {notification.type}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </React.Fragment>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" align="center" mt={3}>No notifications available.</Typography>
                    )}
                </List>
            </Box>
            <IconButton
                onClick={handleOpenModal}
                color="primary"
                sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', backgroundColor: '#1976d2', }}
            >
                <AddIcon sx={{ color: "white", fontSize: 30, fontWeight: 'bold' }} />
            </IconButton>

            {/* <Button onClick={handleOpenModal} variant="contained" color="primary" sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>    Thêm thông báo</Button> */}
            <Dialog open={visibleModal} onClose={handleCloseModal} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
                <DialogTitle>Add New Notification</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="title" label="Title" type="text" fullWidth variant="outlined" value={newNotification.title} onChange={handleChange} />
                    <TextField margin="dense" name="message" label="Message" type="text" fullWidth variant="outlined" value={newNotification.message} onChange={handleChange} />
                    <FormControl fullWidth margin="dense"> <InputLabel>Type</InputLabel> <Select name="type" value={newNotification.type} onChange={handleChange} variant="outlined" >
                        <MenuItem value="An ninh, trật tự">An ninh, trật tự</MenuItem>
                        <MenuItem value="Hoạt động, sự kiện">Hoạt động, sự kiện</MenuItem>
                        <MenuItem value="Nội quy, quy định">Nội quy, quy định</MenuItem>
                        <MenuItem value="Tài chính">Tài chính</MenuItem>
                        <MenuItem value="Bảo trì, sửa chữa">Bảo trì, sửa chữa</MenuItem>
                    </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Notification;
