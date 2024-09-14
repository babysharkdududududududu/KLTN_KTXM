import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'MSSV', width: 70 },
  { field: 'fullName', headerName: 'Họ và tên', width: 160 },
  { field: 'phoneNumber', headerName: 'Số điện thoại', width: 130 },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    width: 150,
  },
  { field: 'roomNumber', headerName: 'Phòng', width: 90 },
  {
    field: 'action',
    headerName: 'Hành động',
    width: 120,
  },
];

const rows = [
  { id: 1, fullName: 'Jon Snow', phoneNumber: '0123456789', address: 'Winterfell', roomNumber: '101', action: 'Xem' },
  { id: 2, fullName: 'Cersei Lannister', phoneNumber: '0987654321', address: 'King\'s Landing', roomNumber: '102', action: 'Xem' },
  { id: 3, fullName: 'Jaime Lannister', phoneNumber: '0112233445', address: 'Casterly Rock', roomNumber: '103', action: 'Xem' },
  { id: 4, fullName: 'Arya Stark', phoneNumber: '0667788990', address: 'Winterfell', roomNumber: '104', action: 'Xem' },
  { id: 5, fullName: 'Daenerys Targaryen', phoneNumber: '0555667788', address: 'Dragonstone', roomNumber: '105', action: 'Xem' },
  { id: 6, fullName: 'Melisandre', phoneNumber: '0444555666', address: 'Asshai', roomNumber: '106', action: 'Xem' },
  { id: 7, fullName: 'Ferrara Clifford', phoneNumber: '0333444555', address: 'N/A', roomNumber: '107', action: 'Xem' },
  { id: 8, fullName: 'Rossini Frances', phoneNumber: '0222333444', address: 'N/A', roomNumber: '108', action: 'Xem' },
  { id: 9, fullName: 'Harvey Roxie', phoneNumber: '0111222333', address: 'N/A', roomNumber: '109', action: 'Xem' },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  return (
    <Paper sx={{ height: 550, width: '65%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
