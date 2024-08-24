import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getRoomRoute, getRoomByIdRoute, updateRoomRoute } from '../API/APIRouter';
import axios from 'axios';
import RoomDialog from './RoomDialog';
import { CheckCircle, Warning } from '@mui/icons-material'; // Import biểu tượng
import './TableData.css';
import { Button, Typography } from '@mui/material';

const columns = [
  { field: 'roomNumber', headerName: 'Tên phòng', width: 120 },
  { field: 'floor', headerName: 'Tầng', width: 70 },
  { field: 'block', headerName: 'Khối', width: 70 },
  { field: 'capacity', headerName: 'Sức chứa', type: 'number', width: 120 },
  { field: 'availableSpot', headerName: 'Số chỗ trống', type: 'number', width: 130 },
  { field: 'description', headerName: 'Mô tả', width: 250 },
  { field: 'type', headerName: 'Loại phòng', width: 120 },
  {
    field: 'status', headerName: 'Trạng thái', width: 120,
    renderCell: (params) => (
      params.value === 'Bảo trì' ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Warning style={{ color: 'red', marginRight: 4 }} />
          Bảo trì
        </span>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle style={{ color: 'green', marginRight: 4 }} />
          Hoạt động
        </span>
      )
    ),
  },
];

const TableData = ({ filterBlock }) => {
  const [listRooms, setListRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed page size of 10

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(getRoomRoute, { params: { all: true } });
      const filteredRooms = filterBlock ? data.data.results.filter(room => room.block === filterBlock) : data.data.results;
      console.log("Filtered rooms:", filteredRooms);
      setListRooms(filteredRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRooms = listRooms.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchRooms();
  }, [filterBlock]);

  const getRoomById = async (id) => {
    try {
      const { data } = await axios.get(`${getRoomByIdRoute}${id}`);
      return data.data;
    } catch (err) {
      console.error("Error fetching room by ID:", err);
      return null;
    }
  };

  const handleCellClick = async (cell) => {
    const roomData = await getRoomById(cell.row.roomNumber);
    if (roomData) {
      setSelectedRoom(roomData);
      setOpenDialog(true);
    }
  };

  const prepareUpdateData = (room) => ({
    _id: room._id,
    description: room.description,
    type: room.type,
    price: room.price,
    waterNumber: room.waterNumber,
    electricityNumber: room.electricityNumber,
    status: room.status,
    availableSpot: room.availableSpot,
    equipment: room.equipment,
    status: room.status === 0 ? '0' : '1'
  });

  const handleSave = async () => {
    try {
      const updateData = prepareUpdateData(selectedRoom);
      const response = await axios.patch(updateRoomRoute, updateData);
      fetchRooms();
      handleCloseDialog();
    } catch (err) {
      console.error("Error updating room:", err.response.data);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setNewEquipment({ name: '', quantity: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('quantity-')) {
      const index = parseInt(name.split('-')[1], 10);
      const updatedEquipment = selectedRoom.equipment.map((item, idx) => (
        idx === index ? { ...item, quantity: Number(value) } : item
      ));
      setSelectedRoom({ ...selectedRoom, equipment: updatedEquipment });
    } else {
      setSelectedRoom({ ...selectedRoom, [name]: value });
    }
  };

  const handleNewEquipmentChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment({ ...newEquipment, [name]: value });
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.quantity > 0) {
      const updatedEquipment = [...selectedRoom.equipment, newEquipment];
      setSelectedRoom({ ...selectedRoom, equipment: updatedEquipment });
      setNewEquipment({ name: '', quantity: 0 });
    }
  };

  const rows = listRooms.map((room) => ({
    id: room._id,
    roomNumber: room.roomNumber,
    floor: room.floor,
    block: room.block,
    capacity: room.capacity,
    availableSpot: room.availableSpot,
    description: room.description || 'N/A',
    type: room.type || 'N/A',
    status: room.status === 1 ? 'Bảo trì' : 'Hoạt động',
  }));

  // Tính tổng số trang
  const roomsPerPage = 10;
  const totalPages = Math.ceil(listRooms.length / pageSize);
  const currentRooms = rows.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);


  return (
<<<<<<< HEAD
    <div style={{ height: '60%', width: '100%', backgroundColor: "#fff" }}>
=======
    <div style={{ height: '81%', width: '100%', backgroundColor: "#fff" }}>
>>>>>>> e11a223910a9c1a2b5879d8b2f6b8952c55b9e53
      <DataGrid
        rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        pageSize={pageSize}
        pagination
        paginationMode="server"
        onPageChange={handlePageChange}
        rowCount={listRooms.length}
        page={currentPage - 1}
        onCellClick={handleCellClick}
        hideFooter
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', position: 'absolute', bottom: 10, left: '35%' }}>
        <Button variant="contained" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}> Trước</Button>
        <Typography variant="body2" style={{ margin: '0 16px' }}>
          Trang {currentPage} / {totalPages}
        </Typography>
        <Button variant="contained" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Sau</Button>
      </div>

      <RoomDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedRoom={selectedRoom}
        onChange={handleChange}
        onSave={handleSave}
        newEquipment={newEquipment}
        onNewEquipmentChange={handleNewEquipmentChange}
        onAddEquipment={handleAddEquipment}
      />
    </div>
  );
};

export default TableData;
