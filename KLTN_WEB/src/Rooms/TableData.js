import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getRoomRoute, getRoomByIdRoute, updateRoomRoute } from '../API/APIRouter';
import axios from 'axios';
import RoomDialog from './RoomDialog';
import { CheckCircle, Warning } from '@mui/icons-material';
import './TableData.css';
import { CircularProgress } from '@mui/material';
import { Pagination } from '@mui/material';


const columns = [
  { field: 'roomNumber', headerName: 'Tên phòng', flex: 1 },
  { field: 'floor', headerName: 'Tầng', flex: 1 },
  { field: 'block', headerName: 'Khối', flex: 1 },
  { field: 'capacity', headerName: 'Sức chứa', type: 'number', flex: 1 },
  { field: 'availableSpot', headerName: 'Chỗ trống', type: 'number', flex: 1 },
  { field: 'description', headerName: 'Mô tả', flex: 2 },
  { field: 'type', headerName: 'Loại phòng', flex: 1 },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
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
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(getRoomRoute, { params: { all: true } });
      const filteredRooms = filterBlock ? data.data.results.filter(room => room.block === filterBlock) : data.data.results;
      setListRooms(filteredRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRooms = listRooms.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(Number(newPage));
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
    if (roomData.room) {
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
    equipment: room.equipment.map(equip => ({
      name: equip.name,
      quantity: equip.quantity,
    })),
    status: room.status === 0 ? '0' : '1'
  });


  const handleSave = async () => {
    try {
      const updateData = prepareUpdateData(selectedRoom.room);
      console.log(selectedRoom.room);
      console.log(updateData);


      const response = await axios.patch(updateRoomRoute, updateData);
      console.log(response.data, '-----------ok');
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
    if (newEquipment.name) {
      const updatedEquipment = [...selectedRoom.equipment, newEquipment];
      print(updatedEquipment);
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

  const totalPages = Math.ceil(listRooms.length / pageSize);

  return (
    <div style={{ height: '81%', width: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress size={50} thickness={5} color="primary" />
        </div>
      ) : (
        <>
          <DataGrid rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)} columns={columns}
            pageSize={pageSize} pagination paginationMode="server" onPageChange={handlePageChange}
            rowCount={listRooms.length} page={currentPage - 1} hideFooter onCellClick={handleCellClick} rowHeight={45}
          />

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Pagination count={totalPages} page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary" variant="outlined" shape="rounded"
              siblingCount={1} boundaryCount={1}
            />
          </div>

          <RoomDialog
            open={openDialog} onClose={handleCloseDialog} selectedRoom={selectedRoom}
            onChange={handleChange} onSave={handleSave} newEquipment={newEquipment}
            onNewEquipmentChange={handleNewEquipmentChange} onAddEquipment={handleAddEquipment}
          />
        </>
      )}
    </div>
  );
};

export default TableData;
