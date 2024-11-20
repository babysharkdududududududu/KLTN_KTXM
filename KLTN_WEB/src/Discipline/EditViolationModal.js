import React from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditViolationModal = ({ openEditModal, handleCloseModal, newDescription, setNewDescription, newViolationDate, setNewViolationDate, violationType, setViolationType, handleSaveViolation }) => {
    return (
        <Modal open={openEditModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: '8px', width: '500px', boxShadow: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Chỉnh sửa vi phạm
                </Typography>
                <FormControl fullWidth sx={{ mt: 3 }}>
                    <InputLabel id="violation-type-label">Loại vi phạm</InputLabel>
                    <Select labelId="violation-type-label" value={violationType} label="Loại vi phạm" onChange={(e) => setViolationType(e.target.value)}>
                        <MenuItem value="Giờ giấc">Giờ giấc</MenuItem>
                        <MenuItem value="Vệ sinh">Vệ sinh</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Ngày vi phạm" type="date" value={newViolationDate} fullWidth sx={{ mt: 2 }}
                    onChange={(e) => setNewViolationDate(e.target.value)}
                    InputLabelProps={{ shrink: true }} inputProps={{ max: new Date().toISOString().split("T")[0] }} />
                <TextField label="Mô tả vi phạm" value={newDescription} fullWidth multiline rows={4} sx={{ mt: 2 }}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSaveViolation} sx={{ width: '48%' }}>
                        Lưu
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ width: '48%' }}>
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditViolationModal;
