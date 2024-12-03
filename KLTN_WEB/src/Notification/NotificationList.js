// NotificationList.js
import React from 'react';
import { Box, List, Card, CardContent, Typography, Button } from '@mui/material';
import Pagination from '@mui/material/Pagination';

const NotificationList = ({ notifications, onViewDetails, onDelete, currentPage, totalPages, onPageChange }) => {
    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <List>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <Card key={notification._id} variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' } }}>
                                {/* Date Section */}
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 0, marginRight: { xs: 0, sm: 5 }, borderWidth: 1, borderColor: 'black', borderStyle: 'solid', paddingBottom: '20px' }}>
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
                                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto', } }}>
                                    <Typography variant="h6" component="h3" gutterBottom>{notification.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>{notification.message.slice(0, 50)}...</Typography>
                                    <Typography variant="caption" color="text.secondary">{new Date(notification.sentAt).toLocaleString()} - {notification.type}</Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                                    <Button onClick={() => onViewDetails(notification)} color="primary">Xem chi tiết</Button>
                                    <Button onClick={() => onDelete(notification._id)} color="secondary">Xóa</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center" mt={3}>Không có thông báo nào.</Typography>
                )}
            </List>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={onPageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default NotificationList;
