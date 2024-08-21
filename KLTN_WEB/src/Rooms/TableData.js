import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getRoomRoute, getRoomByIdRoute, updateRoomRoute } from '../API/APIRouter';
import axios from 'axios';
import RoomDialog from './RoomDialog';
import { CheckCircle, Warning } from '@mui/icons-material'; // Import biểu tượng

import './styles.css';

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
  const [listRooms, setListRooms] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [newEquipment, setNewEquipment] = React.useState({ name: '', quantity: 0 });

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(getRoomRoute);
      const filteredRooms = filterBlock ? data.data.results.filter(room => room.block === filterBlock) : data.data.results;
      setListRooms(filteredRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  React.useEffect(() => {
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
    status: room.status === 0 ? 'Hoạt động' : 'Bảo trì',
  }));

  return (
    <div style={{ height: '98%', width: '100%', backgroundColor: "#fff" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        onCellClick={handleCellClick}
      />

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
