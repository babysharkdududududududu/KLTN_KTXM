import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Hàm tạo dữ liệu cho bảng
function createData(userId, name, address, gender) {
  return { userId, name, address, gender };
}

export default function StudentTable({ studentList, studentDataID }) {
  const rows = studentList.map((student) => {
    return createData(student.userId, student.name, student.address, student.gender);
  });
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>MSSV</TableCell>
            <TableCell align="left">Họ và Tên</TableCell>
            <TableCell align="left">Lớp</TableCell>
            <TableCell align="left">Giới tính</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.mssv}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: studentDataID === row.userId ? '#2f61e7' : 'white',
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ color: studentDataID === row.userId ? 'white' : 'black' }}
              >
                {row.userId}
              </TableCell>
              <TableCell align="left" sx={{ color: studentDataID === row.userId ? 'white' : 'black' }}>
                {row.name}
              </TableCell>
              <TableCell align="left" sx={{ color: studentDataID === row.userId ? 'white' : 'black' }}>
                {row.address}
              </TableCell>
              <TableCell align="left" sx={{ color: studentDataID === row.userId ? 'white' : 'black' }}>
                {row.gender === 1 ? "Nam" : "Nữ"}
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
}
