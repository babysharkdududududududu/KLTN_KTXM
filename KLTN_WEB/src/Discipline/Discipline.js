import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllUserRoute, createDisciplineRoute } from "../API/APIRouter";
import { Box, Pagination, Button, Modal, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Discipline = () => {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newDescription, setNewDescription] = useState(''); // Mô tả mới
    const [newViolationDate, setNewViolationDate] = useState(''); // Ngày vi phạm mới
    const [violationType, setViolationType] = useState('Giờ giấc'); // Loại vi phạm mới (Combobox)
    const pageSize = 10; // Số lượng sinh viên mỗi trang

    // API lấy tất cả người dùng
    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            if (response.data && response.data.data) {
                const users = response.data.data.map(user => {
                    const totalViolationCount = user.disciplines.reduce((acc, discipline) => {
                        return acc + discipline.violationCount;
                    }, 0);

                    return {
                        ...user,
                        violationCount: totalViolationCount
                    };
                });
                setUserData(users);
            } else {
                console.error('Dữ liệu không hợp lệ:', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
    };

    useEffect(() => {
        handleGetAllUser();
    }, []);

    // Lọc dữ liệu theo tên người dùng hoặc mã người dùng
    const filteredUsers = userData.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    // Cột dữ liệu cho DataGrid
    const columns = [
        { field: 'userId', headerName: 'User ID', flex: 1 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Điện thoại', flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', flex: 1 },
        { field: 'faculty', headerName: 'Khoa', flex: 1 },
        { field: 'class', headerName: 'Lớp', flex: 1 },
        {
            field: 'violationCount',
            headerName: 'Số lần vi phạm',
            flex: 1,
            renderCell: (params) => {
                let color;
                const count = params.value;

                if (count === 0) {
                    color = 'green'; // Màu xanh
                } else if (count >= 1 && count <= 3) {
                    color = 'orange'; // Màu vàng
                } else if (count === 4) {
                    color = 'red'; // Màu đỏ
                } else {
                    color = 'black'; // Mặc định
                }

                return (
                    <Typography sx={{ color, fontWeight: 'bold' }}>
                        {count}
                    </Typography>
                );
            }
        },
    ];

    // Hàm xử lý khi chọn sinh viên
    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    // Hàm mở modal chỉnh sửa
    const handleOpenEditModal = () => {
        setOpenEditModal(true);
        setNewDescription('');
        setNewViolationDate('');
        setViolationType('Giờ giấc');
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setSelectedUser(null);
        setOpenEditModal(false);
    };

    // Hàm xử lý lưu thông tin vi phạm mới
    const handleSaveViolation = async () => {
        if (!newDescription || !newViolationDate) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        const descriptionData = {
            content: newDescription,
            violationDate: newViolationDate,
            violationType: violationType,
        };
        const createDisciplineData = {
            userId: selectedUser.userId,
            violationDate: newViolationDate,
            penalty: "Cảnh cáo",
            descriptions: [descriptionData]
        };
        try {
            const response = await axios.post(createDisciplineRoute, createDisciplineData);
            console.log("Vi phạm đã được lưu:", response.data);
            handleGetAllUser();
            handleCloseModal();
        } catch (error) {
            console.error('Lỗi khi lưu thông tin vi phạm:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
            {/* TextField tìm kiếm */}


            <Box sx={{ flex: 3, width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    label="Tìm kiếm sinh viên theo tên hoặc mã"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{
                        mb: 1, '.MuiInputLabel-root': {
                            fontWeight: 'bold'
                        }
                    }}
                />
                <DataGrid
                    rows={paginatedUsers}
                    columns={columns}
                    pageSize={paginatedUsers.length}
                    autoHeight
                    hideFooter
                    getRowId={(row) => row.userId}
                    onRowClick={(params) => handleSelectUser(params.row)}
                    sx={{ width: '100%', padding: '1px', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
                />



                {/* Phân trang */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </div>
            </Box>

            {/* Modal hiển thị chi tiết vi phạm */}
            <Modal open={!!selectedUser} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: '8px', width: '500px', boxShadow: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Chi tiết vi phạm của {selectedUser?.name}
                    </Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                        <strong>Số lần vi phạm:</strong> {selectedUser?.violationCount}
                    </Typography>
                    <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
                        <strong>Danh sách vi phạm:</strong>
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        {selectedUser?.disciplines.map((discipline, index) => (
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

            {/* Modal chỉnh sửa vi phạm */}
            <Modal open={openEditModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: '8px', width: '500px', boxShadow: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Chỉnh sửa vi phạm cho {selectedUser?.name}
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
        </Box>
    );
};

export default Discipline;
