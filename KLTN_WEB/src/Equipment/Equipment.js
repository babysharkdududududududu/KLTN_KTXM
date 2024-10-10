import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllEquipmentRoute, updateLocationEquipmentRoute } from "../API/APIRouter";
import EquipmentDialog from './EquipmentDialog/EquipmentDialog';
import { Box, Tabs, Tab, TextField, Pagination, Button } from '@mui/material';
import PrintButton from "./PrintEquipment/PrintEquipment";
import { DataGrid } from '@mui/x-data-grid';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [uniqueNameEquipment, setUniqueNameEquipment] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [updatedRoomNumber, setUpdatedRoomNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10; // Đặt số lượng bản ghi mỗi trang là 10
    const statusText = { 1: 'Hoạt động', 2: 'Kiểm tra', 3: 'Xử lý', 4: 'Sửa chữa', 5: 'Hoạt động', 6: 'Không sửa được' };
    const statusColors = { 1: '#4caf50', 2: '#1976d2', 3: '#ff9800', 4: '#9c27b0', 5: '#4caf50', 6: '#d32f2f' };

    // API get all equipment
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

    // API update location equipment
    const handleUpdateLocationEquipment = async () => {
        if (selectedEquipment) {
            try {
                const rs = await axios.patch(`${updateLocationEquipmentRoute}/${selectedEquipment.equipNumber}`, { roomNumber: updatedRoomNumber });
                console.log(rs);
                handleCloseDialog();
                handleGetAllEquipment();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEquipment(null);
        setUpdatedRoomNumber('');
    };

    const handleSelectEquipment = (equip) => {
        setSelectedEquipment(equip);
        setUpdatedRoomNumber(equip.roomNumber);
        setOpenDialog(true);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        handleGetAllEquipment();
    }, []);

    const filteredEquipment = equipment.filter(equip => {
        const matchesSearchTerm =
            equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.equipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSelectedTab = selectedTab === 0 || equip.name === uniqueNameEquipment[selectedTab - 1];
        return matchesSearchTerm && matchesSelectedTab;
    });

    // Tính toán các bản ghi cho trang hiện tại
    const paginatedEquipment = filteredEquipment.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredEquipment.length / pageSize); // Tính tổng số trang

    const columns = [
        { field: 'equipNumber', headerName: 'Mã thiết bị', flex: 1 },
        { field: 'name', headerName: 'Tên thiết bị', flex: 1 },
        { field: 'roomNumber', headerName: 'Số phòng', flex: 1 },
        {
            field: 'status', headerName: 'Trạng thái', flex: 1, renderCell: (params) => (
                <div style={{ color: statusColors[params.value], fontWeight: 'bold' }}>
                    {statusText[params.value]}
                </div>
            )
        },
        {
            field: 'action', headerName: 'Hành động', flex: 1, renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSelectEquipment(params.row)}
                    sx={{ borderRadius: '8px', fontSize: '10px', }}
                >
                    Chỉnh sửa
                </Button>
            )
        },
    ];

    return (
        <Box sx={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {/* Bảng và Tabs bên trái */}
            <Box sx={{ flex: 3, marginRight: '20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                        <Tab label="Tất cả" />
                        {uniqueNameEquipment.map((name, index) => (
                            <Tab key={index} label={name} />
                        ))}
                    </Tabs>
                </Box>

                <DataGrid
                    rows={paginatedEquipment}
                    columns={columns}
                    pageSize={pageSize}
                    autoHeight
                    hideFooter
                    getRowId={(row) => row.equipNumber}
                    sx={{ height: 400, width: '90%', padding: '1px', borderRadius: '8px', marginLeft: '20px', backgroundColor: '#fcfcfc' }}
                />

                {/* Phân trang */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </div>
            </Box>

            <Box sx={{ marginRight: '10px', backgroundColor: '#fcfcfc', padding: '30px', borderRadius: '5px' }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', }}>
                    <TextField
                        variant="outlined"
                        label="Tìm kiếm thiết bị"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginBottom: '20px', width: '340px' }}
                    />
                    <PrintButton equipment={filteredEquipment} />
                </Box>

                <EquipmentDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    equipment={selectedEquipment}
                    updatedRoomNumber={updatedRoomNumber}
                    onRoomNumberChange={setUpdatedRoomNumber}
                    onUpdate={handleUpdateLocationEquipment}
                />
            </Box>
        </Box>
    );
};

export default Equipment;
