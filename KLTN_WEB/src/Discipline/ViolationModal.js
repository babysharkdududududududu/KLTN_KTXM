import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ViolationModal = ({ selectedUser, handleOpenEditModal, handleCloseModal }) => {
    if (!selectedUser) return null; // Trả về null nếu không có sinh viên được chọn

    return (
        <Modal open={!!selectedUser} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: '8px', width: '500px', boxShadow: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Chi tiết vi phạm của {selectedUser.name}
                </Typography>
                <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                    <strong>Số lần vi phạm:</strong> {selectedUser.violationCount}
                </Typography>
                <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                    <strong>Danh sách vi phạm:</strong>
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {selectedUser.disciplines?.map((discipline, index) => ( // Kiểm tra xem disciplines có tồn tại không
                        <Box key={index} sx={{ mt: 1, border: '1px solid #e0e0e0', borderRadius: '4px', padding: 2 }}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Vi phạm {index + 1}:
                            </Typography>
                            {discipline.descriptions.map((description, descIndex) => (
                                <Box key={descIndex} sx={{ mt: 1, ml: 2 }}>
                                    <Typography>
                                        <strong>Loại vi phạm:</strong> {description.violationType}
                                    </Typography>
                                    <Typography>
                                        <strong>Mô tả:</strong> {description.content}
                                    </Typography>
                                    <Typography>
                                        <strong>Ngày vi phạm:</strong> {new Date(description.violationDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
                <Button variant="contained" color="primary" onClick={handleOpenEditModal} sx={{ mt: 3, width: '100%' }}>
                    Chỉnh sửa
                </Button>
            </Box>
        </Modal>
    );
};

export default ViolationModal;
