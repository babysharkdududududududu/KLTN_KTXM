// NotificationModal.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const NotificationModal = ({ open, onClose, newNotification, onChange, onSave, types }) => {
    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
            <DialogTitle>Thêm Thông Báo Mới</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" name="title" label="Tiêu đề" fullWidth value={newNotification.title} onChange={onChange} />
                <TextField margin="dense" name="message" label="Nội dung" multiline rows={4} fullWidth value={newNotification.message} onChange={onChange} />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Loại Thông Báo</InputLabel>
                    <Select name="type" value={newNotification.type} onChange={onChange}>
                        {types.map((type, index) => (
                            <MenuItem key={index} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Hủy</Button>
                <Button onClick={onSave} color="primary">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotificationModal;
