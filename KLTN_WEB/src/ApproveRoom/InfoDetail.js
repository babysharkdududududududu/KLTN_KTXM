import * as React from 'react';
import Paper from '@mui/material/Paper';
import LoadingMedia from './LoadingMedia';
import { Typography, Box, Divider, Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { updateStatusPending, updateStatusRejected, updateStatusAwaitingPayment, updateStatusPaid, updateStatusRoomAssigned } from '../API/APIRouter';

export default function InfoDetail({ student, updateStudentData }) {
  const [value, setValue] = React.useState('blockI');
  const [floor, setFloor] = React.useState('');
  const [room, setRoom] = React.useState('');
  const [showRoomSelection, setShowRoomSelection] = React.useState(false);

  React.useEffect(() => {
    if (student) {
      setValue(student.gender === '1' ? 'blockI' : student.gender === '2' ? 'blockG' : 'blockI');
      setRoom('');
      setFloor('');
      setShowRoomSelection(false);
    }
  }, [student]);

  const handleApprove = async () => {
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
      console.log('Đơn đã được duyệt:', data);
      updateStudentData({ ...student, status: 'ACCEPTED' });
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
    }
  };

  const handleReject = async () => {
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
    } catch (error) {
      console.error('Lỗi khi từ chối đơn:', error);
    }
  };

  const handleConfirmPayment = async () => {
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
      setShowRoomSelection(true);
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
    }
  };

  const handleAssignRoom = async () => {
    try {
      const response = await fetch(`${updateStatusRoomAssigned}/${student.submitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomNumber: room.toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      updateStudentData({ ...student, status: 'ASSIGNED', roomNumber: room.toLowerCase() });
    } catch (error) {
      console.error('Lỗi khi xếp phòng:', error);
    }
  };


  const handleChange = (event) => {
    setValue(event.target.value);
    setFloor('');
    setRoom('');
  };

  const handleChangeFloor = (event) => {
    setFloor(event.target.value);
    setRoom('');
  };

  const handleChangeRoom = (event) => {
    setRoom(event.target.value);
  };

  const getFloors = () => {
    return value === 'blockG' ? Array.from({ length: 9 }, (_, i) => i + 1) : Array.from({ length: 11 }, (_, i) => i + 3);
  };

  const getRooms = () => {
    if (value === 'blockG' && floor) {
      return Array.from({ length: 10 }, (_, i) => `G${floor}${i + 1 < 10 ? '0' : ''}${i + 1}`);
    } else if (value === 'blockI' && floor) {
      return Array.from({ length: 14 }, (_, i) => `I${floor}${i + 1 < 10 ? '0' : ''}${i + 1}`);
    }
    return [];
  };

  return (
    <Paper sx={{ height: 550, width: '33%', display: 'flex', flexDirection: 'column' }}>
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
          <Typography variant="body1">
            <strong>Giới tính:</strong> {student.gender === "1" ? 'Nam' : student.gender === "2" ? 'Nữ' : 'Chưa xác định'}
          </Typography>
          {(student.status === 'PAID' || showRoomSelection) && (
            <>
              <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
              <div style={{ marginTop: 10 }}>
                <label style={{ fontSize: 17, fontWeight: "bold" }}>CHỌN PHÒNG</label>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <FormControl>
                    <FormLabel>Tòa nhà</FormLabel>
                    <RadioGroup
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="blockI" control={<Radio />} label="Tòa I" />
                      <FormControlLabel value="blockG" control={<Radio />} label="Tòa G" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl sx={{ width: 120 }}>
                    <FormLabel>Tầng</FormLabel>
                    <Select
                      value={floor}
                      onChange={handleChangeFloor}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">
                        <em>Chọn tầng</em>
                      </MenuItem>
                      {getFloors().map((floor) => (
                        <MenuItem key={floor} value={floor}>{floor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ width: 120 }}>
                    <FormLabel>Phòng</FormLabel>
                    <Select
                      value={room}
                      onChange={handleChangeRoom}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">
                        <em>Chọn phòng</em>
                      </MenuItem>
                      {getRooms().map((room) => (
                        <MenuItem key={room} value={room}>{room}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </>
          )}
          <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
          <div style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            {!['ASSIGNED', 'AWAITING_PAYMENT'].includes(student.status) && (
              <Button variant="outlined" color="error" style={{ marginRight: 10 }} onClick={handleReject}>
                {student.status === 'REJECTED' ? 'DUYỆT LẠI' : 'TỪ CHỐI'}
              </Button>
            )}
            {student.status === 'PENDING' && (
              <Button
                variant="contained"
                color="success"
                onClick={handleApprove}
              >
                DUYỆT ĐƠN
              </Button>
            )}
            {student.status === 'AWAITING_PAYMENT' && (
              <Button
                variant="contained"
                color="success"
                onClick={handleConfirmPayment}
              >
                ĐÃ THANH TOÁN
              </Button>
            )}
            {student.status === 'PAID' && (
              <Button
                variant="contained"
                color="success"
                disabled={!room}
                onClick={handleAssignRoom}
              >
                XÁC NHẬN
              </Button>
            )}
          </div>
        </Box>
      ) : (
        <LoadingMedia />
      )}
    </Paper>
  );
}
