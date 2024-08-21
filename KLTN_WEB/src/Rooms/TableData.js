import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'roomNumber', headerName: 'Tên phòng', width: 90 },
  { field: 'state', headerName: 'Trạng thái', width: 130 },
  { field: 'price', headerName: 'Giá', type: 'number', width: 90 },
  { field: 'warterNumber', headerName: 'Số nước', type: 'number', width: 90, },
  { field: 'electicNumber', headerName: 'Số điện', type: 'number', width: 90 }
];

const rows = [
  { id: 102, roomNumber: 102, state: '8/16', price: 500, warterNumber: 10, electicNumber: 15 },
  { id: 103, roomNumber: 103, state: '8/16', price: 600, warterNumber: 20, electicNumber: 25 },
  { id: 104, roomNumber: 104, state: '8/16', price: 550, warterNumber: 15, electicNumber: 20 },
  { id: 105, roomNumber: 105, state: '8/16', price: 700, warterNumber: 30, electicNumber: 35 },
  { id: 106, roomNumber: 106, state: '8/16', price: 650, warterNumber: 10, electicNumber: 15 },
  { id: 107, roomNumber: 107, state: '8/16', price: 800, warterNumber: 25, electicNumber: 30 },
  { id: 108, roomNumber: 108, state: '8/16', price: 600, warterNumber: 20, electicNumber: 25 },
  { id: 109, roomNumber: 109, state: '8/16', price: 750, warterNumber: 15, electicNumber: 20 },
  { id: 110, roomNumber: 110, state: '8/16', price: 700, warterNumber: 10, electicNumber: 15 },
  { id: 111, roomNumber: 111, state: '8/16', price: 900, warterNumber: 30, electicNumber: 35 },
  { id: 112, roomNumber: 112, state: '8/16', price: 850, warterNumber: 25, electicNumber: 30 },
  { id: 113, roomNumber: 113, state: '8/16', price: 800, warterNumber: 20, electicNumber: 25 },
  { id: 114, roomNumber: 114, state: '8/16', price: 950, warterNumber: 15, electicNumber: 20 },
  { id: 115, roomNumber: 115, state: '8/16', price: 900, warterNumber: 10, electicNumber: 15 },
  { id: 116, roomNumber: 116, state: '8/16', price: 1100, warterNumber: 30, electicNumber: 35 },
  { id: 117, roomNumber: 117, state: '8/16', price: 1050, warterNumber: 25, electicNumber: 30 },
  { id: 118, roomNumber: 118, state: '8/16', price: 1000, warterNumber: 20, electicNumber: 25 },
  { id: 119, roomNumber: 119, state: '8/16', price: 1150, warterNumber: 15, electicNumber: 20 },
  { id: 120, roomNumber: 120, state: '8/16', price: 1100, warterNumber: 10, electicNumber: 15 },
  { id: 121, roomNumber: 121, state: '8/16', price: 1300, warterNumber: 30, electicNumber: 35 },
  { id: 122, roomNumber: 122, state: '8/16', price: 1250, warterNumber: 25, electicNumber: 30 },
  { id: 123, roomNumber: 123, state: '8/16', price: 1200, warterNumber: 20, electicNumber: 25 },
];


const TableData = () => {
  return (
    <div style={{ height: '60%', width: '100%', backgroundColor: "#fff" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  )
}
export default TableData;