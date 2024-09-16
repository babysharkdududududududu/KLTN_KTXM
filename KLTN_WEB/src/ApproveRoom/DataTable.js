import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'MSSV', width: 90 },
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

export default function DataTable({ studentData, handleRowClick }) {
  return (
    <Paper sx={{ height: 550, width: '65%' }}>
      <DataGrid
        rows={studentData}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowClick={(params) => {
          handleRowClick(params.row);
        }}
      />

    </Paper>
  );
}
