import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { updateStatusPending, updateStatusRejected, updateStatusPaid } from '../API/APIRouter';

const columns = (handleApprove, handleReject, handleConfirmPayment, handleAssignRoomTable) => [
  { field: 'id', headerName: 'MSSV', flex: 0.5 },
  { field: 'fullName', headerName: 'Họ và tên', flex: 1 },
  { field: 'phoneNumber', headerName: 'Số điện thoại', flex: 0.7 },
  { field: 'address', headerName: 'Địa chỉ', flex: 2 },
  { field: 'roomNumber', headerName: 'Phòng', flex: 0.5 },
  { field: 'status', headerName: 'Trạng thái', flex: 1 },
  {
    field: 'action',
    headerName: 'Hành động',
    flex: 1.3,
    renderCell: (params) => {
      return (
        <>
          {params.row.status === 'PENDING' && (
            <Button variant="contained" color="success" onClick={() => handleApprove(params.row)}>
              DUYỆT ĐƠN
            </Button>
          )}
          {params.row.status === 'AWAITING_PAYMENT' && (
            <Button variant="contained" color="success" onClick={() => handleConfirmPayment(params.row)}>
              ĐÃ THANH TOÁN
            </Button>
          )}
          {params.row.status === 'PAID' && (
            <Button variant="contained" color="primary" onClick={() => handleAssignRoomTable(params.row)}>
              XẾP PHÒNG
            </Button>
          )}
          {params.row.status === 'ASSIGNED' && (
            <Button variant="contained" color="primary" onClick={() => handleAssignRoomTable(params.row)}>
              CHUYỂN PHÒNG
            </Button>
          )}
          {params.row.status === 'REJECTED' ? (
            <Button variant="outlined" color="error" onClick={() => handleApprove(params.row)}>
              DUYỆT LẠI
            </Button>
          ) : (
            (params.row.status === 'PENDING' || params.row.status === 'WAITING_PAYMENT' || params.row.status === 'ACCEPTED') && (
              <Button sx={{ ml: 1 }} variant="outlined" color="error" onClick={() => handleReject(params.row)}>
                TỪ CHỐI
              </Button>
            )
          )}
        </>
      );
    },
  },
];

export default function DataTable({ studentData, handleRowClick, updateStudentData, handleAssignRoom }) {

  const handleApprove = async (student) => {
    try {
      const response = await fetch(`${updateStatusPending}/${student.submitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      updateStudentData({ ...student, status: 'ACCEPTED' });
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
    }
  };

  const handleReject = async (student) => {
    try {
      const response = await fetch(`${updateStatusRejected}/${student.submitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Đơn đã bị từ chối:', data);
      updateStudentData({ ...student, status: 'REJECTED' });
    } catch (error) {
      console.error('Lỗi khi từ chối đơn:', error);
    }
  };

  const handleConfirmPayment = async (student) => {
    try {
      const response = await fetch(`${updateStatusPaid}/${student.submitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Đơn đã được xác nhận thanh toán:', data);
      updateStudentData({ ...student, status: 'PAID' });
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
    }
  };

  const handleAssignRoomTable = async (student) => {
    handleAssignRoom(student);
  };

  return (
    <Paper sx={{ height: '100%', width: '98%' }}>
      <DataGrid
        rows={studentData}
        columns={columns(handleApprove, handleReject, handleConfirmPayment, handleAssignRoomTable)}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowClick={(params) => handleRowClick(params.row)}
      />
    </Paper>
  );
}
