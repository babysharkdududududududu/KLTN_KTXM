// ConfirmDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="secondary">Hủy</Button>
                <Button onClick={onConfirm} color="primary">Xóa</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
