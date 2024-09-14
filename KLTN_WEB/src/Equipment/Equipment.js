import axios from "axios";
import { getAllEquipmentRoute, updateLocationEquipmentRoute } from "../API/APIRouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Typography, Grid, Box, Pagination, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [uniqueNameEquipment, setUniqueNameEquipment] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [updatedRoomNumber, setUpdatedRoomNumber] = useState(''); // Thêm state để lưu số phòng
    const itemsPerPage = 20;
    const statusColors = { 1: '#4caf50', 2: '#1976d2', 3: '#ff9800', 4: '#9c27b0', 5: '#4caf50', 6: '#d32f2f' };

    const statusText = { 1: 'Hoạt động', 2: 'Kiểm tra', 3: 'Xử lý', 4: 'Sửa chữa', 5: 'Hoạt động', 6: 'Không sửa được' };

    const handleGetAllEquipment = async () => {
        try {
            const rs = await axios.get(`${getAllEquipmentRoute}`);
            const equipmentData = rs.data.data;
            setEquipment(equipmentData);
            const nameEquipment = equipmentData.map((equip) => equip.name);
            const uniqueNames = Array.from(new Set(nameEquipment));
            setUniqueNameEquipment(uniqueNames);
        } catch (err) {
            console.error(err);
        }
    };

    // Cập nhật số phòng của thiết bị
    const handleUpdateLocationEquipment = async () => {
        if (selectedEquipment) {
            try {
                const rs = await axios.patch(`${updateLocationEquipmentRoute}/${selectedEquipment.equipNumber}`, { roomNumber: updatedRoomNumber });
                console.log(rs);
                handleCloseDialog(); // Đóng dialog sau khi cập nhật thành công
                handleGetAllEquipment(); // Lấy lại danh sách thiết bị mới nhất
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        handleGetAllEquipment();
    }, []);

    const filteredEquipment = selectedTab === 0
        ? equipment
        : equipment.filter((equip) => equip.name === uniqueNameEquipment[selectedTab - 1]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEquipment = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        setCurrentPage(1);
    };

    const handleOpenDialog = (equip) => {
        setSelectedEquipment(equip);
        setUpdatedRoomNumber(equip.roomNumber); // Gán số phòng ban đầu
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box sx={{ height: '100%', width: '100%', overflowX: 'hidden', marginTop: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable equipment tabs">
                    <Tab label="Tất cả" />
                    {uniqueNameEquipment.map((name, index) => (
                        <Tab key={index} label={name} />
                    ))}
                </Tabs>
            </Box>

            <Grid container spacing={2} justifyContent="center">
                {currentEquipment.map((equip) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.1} key={equip._id}>
                        <Card
                            variant="outlined"
                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '180px', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', borderRadius: '12px', cursor: 'pointer', }}
                            onClick={() => handleOpenDialog(equip)}
                        >
                            <CardHeader title={equip.name} sx={{ backgroundColor: '#e3f2fd', borderBottom: '1px solid #bbdefb', textAlign: 'center', padding: '12px', fontSize: '16px', fontWeight: 'bold', color: '#333', }} />
                            <CardContent sx={{ textAlign: 'left', padding: '12px' }}>
                                <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: '8px' }}>
                                    <strong>Mã số:</strong> {equip.equipNumber}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                    <strong>Phòng:</strong> {equip.roomNumber}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Pagination count={Math.ceil(filteredEquipment.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" variant="outlined" shape="rounded" siblingCount={1} boundaryCount={1} />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Thông tin chi tiết thiết bị</DialogTitle>
                <DialogContent dividers sx={{ padding: '24px' }}>
                    {selectedEquipment && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                                    <strong>Tên thiết bị:</strong> {selectedEquipment.name}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                                    <strong>Mã số:</strong> {selectedEquipment.equipNumber}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                                    <strong>Trạng thái:</strong>
                                    <span style={{ color: statusColors[selectedEquipment.status] }}>
                                        {statusText[selectedEquipment.status] || 'Không xác định'}
                                    </span>
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                                    <strong>Ngày bắt đầu:</strong> {new Date(selectedEquipment.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ngày kết thúc:</strong> {new Date(selectedEquipment.endDate).toLocaleDateString()}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    label="Số phòng"
                                    fullWidth
                                    value={updatedRoomNumber} // Bind giá trị state
                                    onChange={(e) => setUpdatedRoomNumber(e.target.value)} // Cập nhật state khi người dùng nhập
                                    sx={{ marginBottom: '12px' }}
                                />
                                <Typography variant="body1" sx={{ marginBottom: '12px' }}>
                                    <strong>Số lần sửa chữa:</strong> {selectedEquipment.repairNumber}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Vị trí:</strong> [
                                    {selectedEquipment.location.map((loc, index) => (
                                        index === selectedEquipment.location.length - 1 ?
                                            <span style={{ color: 'red' }} key={index}>'{loc}'</span> :
                                            <span key={index}>'{loc}', </span>
                                    ))}
                                    ]
                                </Typography>

                                <Typography variant="body1">
                                    <strong>Ngày sửa chữa:</strong> {new Date(selectedEquipment.fixedDate).toLocaleDateString()}
                                </Typography>

                                <Typography variant="body1">
                                    <strong>Lịch sử sửa chữa:</strong>
                                </Typography>
                                <ul>
                                    {selectedEquipment.repairHistory.map((date, index) => (
                                        <li key={index}>{new Date(date).toLocaleString()}</li>
                                    ))}
                                </ul>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary" variant="contained">Hủy</Button>
                    <Button onClick={handleUpdateLocationEquipment} color="primary" variant="contained">Cập nhật</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Equipment;
