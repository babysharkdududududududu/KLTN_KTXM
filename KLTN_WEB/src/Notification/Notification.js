// Notification.js
import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BackIcon from '@mui/icons-material/ArrowBack';
import NotificationList from './NotificationList';
import NotificationModal from './NotificationModal';
import ConfirmDialog from './ConfirmDialog';
import { createNotificationRoute, deleteNotificationRoute, getNotificationRoute } from '../API/APIRouter';
import axios from 'axios';
import { useUser } from '../Context/Context';
import { useWebSocket } from '../Context/WebSocketContext';

const Notification = () => {
    const { sendMessage } = useWebSocket();
    const [notifications, setNotifications] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [typeFilter, setTypeFilter] = useState(['Bảo trì, sửa chữa', 'Tài chính', 'Nội quy, quy định', 'Hoạt động, sự kiện', 'An ninh, trật tự']);
    const [selectedFilter, setSelectedFilter] = useState(''); // State to hold the selected filter
    const [newNotification, setNewNotification] = useState({ title: '', message: '', type: '' });
    const { roleId } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const handleOpenModal = () => {
        setVisibleModal(true);
    };

    const handleCloseModal = () => {
        setVisibleModal(false);
        setNewNotification({ title: '', message: '', type: '' });
    };

    const handleChange = (e) => {
        setNewNotification({
            ...newNotification,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            await axios.post(createNotificationRoute, newNotification);
            fetchNotifications();
            handleCloseModal();
            sendMessage(newNotification);
        } catch (error) {
            console.error('Failed to create notification:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(getNotificationRoute);
            const notificationResults = response.data.data.results;
            setNotifications(notificationResults);
            const filteredNotificationsCount = selectedFilter
                ? notificationResults.filter(notification => notification.type === selectedFilter).length
                : notificationResults.length;
            setTotalPages(Math.ceil(filteredNotificationsCount / itemsPerPage));
            setCurrentPage(1);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogData, setConfirmDialogData] = useState({ id: null, title: '', message: '' });

    const handleDelete = async (id) => {
        setConfirmDialogOpen(true);
        setConfirmDialogData({ id, title: 'Xóa thông báo', message: 'Bạn có chắc chắn muốn xóa thông báo này?' });
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${deleteNotificationRoute}/${confirmDialogData.id}`);
            fetchNotifications();
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDialogOpen(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Filter notifications based on selected filter
    const filteredNotifications = selectedFilter
        ? notifications.filter(notification => notification.type === selectedFilter)
        : notifications;

    // Sort by most recent notifications and implement pagination
    const sortedNotifications = filteredNotifications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleBack = () => {
        window.history.back();
    };

    // Modal for Notification Details
    const handleViewDetails = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseDetails = () => {
        setSelectedNotification(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: 4 }}>
            {/* Icon back */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2, cursor: 'pointer', display: { xs: 'flex', md: 'none' } }}>
                <Avatar sx={{ backgroundColor: '#1976d2' }} onClick={handleBack}>
                    <BackIcon />
                </Avatar>
            </Box>

            {/* Filter Dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, padding: 2, textAlign: 'center' }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Loại Thông Báo</InputLabel>
                    <Select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        label="Loại Thông Báo"
                        sx={{ borderRadius: '8px' }} // Rounded corners for the Select component
                    >
                        <MenuItem value="">
                            <em>Tất cả</em>
                        </MenuItem>
                        {typeFilter.map((type, index) => (
                            <MenuItem key={index} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    onClick={handleOpenModal}
                    color="primary"
                    variant="contained"
                    sx={{
                        marginLeft: 2,
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                        },
                    }}
                >
                    Thêm thông báo
                </Button>
            </Box>


            {/* Notification List */}
            <NotificationList
                notifications={paginatedNotifications}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Add Notification Button */}
            {/* {
                roleId === 'USERS' ? null : (
                    <IconButton onClick={handleOpenModal} color="primary" sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', backgroundColor: '#1976d2' }}>
                        <AddIcon sx={{ color: "white", fontSize: 30, fontWeight: 'bold' }} />
                    </IconButton>
                )
            } */}

            {/* Add Notification Modal */}
            <NotificationModal
                open={visibleModal}
                onClose={handleCloseModal}
                newNotification={newNotification}
                onChange={handleChange}
                onSave={handleSave}
                types={typeFilter}
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title={confirmDialogData.title}
                message={confirmDialogData.message}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Notification Details Modal */}
            <Dialog open={!!selectedNotification} onClose={handleCloseDetails} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
                <DialogTitle>Chi Tiết Thông Báo</DialogTitle>
                <DialogContent>
                    {selectedNotification && (
                        <>
                            <Typography variant="h6" gutterBottom>{selectedNotification.title}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{selectedNotification.message}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(selectedNotification.sentAt).toLocaleString()} - {selectedNotification.type}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Notification;
