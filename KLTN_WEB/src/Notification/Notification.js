import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotificationRoute } from '../API/APIRouter';
import axios from 'axios';
import { Box } from '@mui/material';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(getNotificationRoute);
                const notificationResults = response.data.data.results;
                setNotifications(notificationResults);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Notifications
            </Typography>
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
                                        <Typography variant="h6" component="h3" gutterBottom>
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(notification.sentAt).toLocaleString()} - {notification.type}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center" mt={3}>
                        No notifications available.
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default Notification;
