import * as React from 'react';
import Paper from '@mui/material/Paper';
import LoadingMedia from './LoadingMedia';
import { Typography, Box, Divider } from '@mui/material';

export default function InfoDetail({ student }) {
  return (
    <Paper sx={{ height: 550, width: '32%', display: 'flex', flexDirection: 'column' }}>
      {student ? (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Thông tin sinh viên
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography variant="body1"><strong>MSSV:</strong> {student.id}</Typography>
          <Typography variant="body1"><strong>Họ và tên:</strong> {student.fullName}</Typography>
          <Typography variant="body1"><strong>Số điện thoại:</strong> {student.phoneNumber}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {student.email}</Typography>
          <Typography variant="body1"><strong>Ngày tháng năm sinh:</strong> {student.dateOfBirth}</Typography>
          <Typography variant="body1"><strong>Địa chỉ:</strong> {student.address}</Typography>
          <Typography variant="body1"><strong>Giới tính:</strong> {student.gender}</Typography>
          <Typography variant="body1"><strong>Phòng:</strong> {student.roomNumber}</Typography>
        </Box>
      ) : (
        <LoadingMedia />
      )}
    </Paper>
  );
}
