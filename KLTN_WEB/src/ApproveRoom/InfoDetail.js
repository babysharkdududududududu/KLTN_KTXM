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
import axios from 'axios';
import { updateStatusPending, updateStatusRejected, updateStatusAwaitingPayment, updateStatusPaid, updateStatusRoomAssigned, getAllRoomRoute } from '../API/APIRouter';
import { set } from 'date-fns';
import CircleIcon from '@mui/icons-material/Circle'; // Thêm import cho icon


export default function InfoDetail({ student, updateStudentData }) {
  const [value, setValue] = React.useState('blockI');
  const [floor, setFloor] = React.useState('');
  const [room, setRoom] = React.useState('');
  const [showRoomSelection, setShowRoomSelection] = React.useState(false);
  const [roomList, setRoomList] = React.useState([]);
  const [floors, setFloors] = React.useState([]);
  const [blocks, setBlocks] = React.useState([]);
  const [roomBlockG, setRoomBlockG] = React.useState([]);
  const [roomBlockI, setRoomBlockI] = React.useState([]);
  const [floorBlockG, setFloorBlockG] = React.useState([]);
  const [floorBlockI, setFloorBlockI] = React.useState([]);

  React.useEffect(() => {
    if (student) {
      setValue(student.gender === '1' ? 'blockI' : student.gender === '2' ? 'blockG' : 'blockI');
      setRoom('');
      setFloor('');
      setShowRoomSelection(false);
    }
  }, [student]);

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

  const getAllRooms = async () => {
    try {
      const response = await axios.get(getAllRoomRoute);
      const results = response.data.data.results;

      setRoomList(results);
      const newBlocks = [...new Set(results.map((room) => room.block))];
      setBlocks(newBlocks);

      const floorBlockG = [...new Set(results.filter((room) => room.block === 'G').map((room) => room.floor))];
      // const roomBlockG = [...new Set(results.filter((room) => room.block === 'G').map((room) => room.roomNumber))];
      const roomBlockG = [
        ...new Set(
          results
            .filter((room) => room.block === 'G')
            .map((room) => ({
              roomNumber: room.roomNumber,
              availableSpot: room.availableSpot
            }))
        )
      ];


      setFloorBlockG(floorBlockG);
      setRoomBlockG(roomBlockG);

      const floorBlockI = [...new Set(results.filter((room) => room.block === 'I').map((room) => room.floor))];
      // const roomBlockI = [...new Set(results.filter((room) => room.block === 'I').map((room) => room.roomNumber))];
      const roomBlockI = [
        ...new Set(
          results
            .filter((room) => room.block === 'I')
            .map((room) => ({
              roomNumber: room.roomNumber,
              availableSpot: room.availableSpot
            }))
        )
      ];

      setFloorBlockI(floorBlockI);
      setRoomBlockI(roomBlockI);

      setRoomList(results.map((room) => room.roomNumber));

      if (newBlocks.length > 0) {
        setValue(newBlocks[0]);
      }

      const uniqueFloors = [...new Set(results.map((room) => room.floor))];
      if (uniqueFloors.length > 0) {
        setFloor(uniqueFloors[0]);
      }
      setRoom('');

    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng:', error);
    }
  };

  React.useEffect(() => {
    getAllRooms();
  }, [student]);



  React.useEffect(() => {
    getAllRooms();
  }, [student]);


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
    if (value === 'G') {
      return floorBlockG;
    } else if (value === 'I') {
      return floorBlockI;
    }
    return [];
  };

  const getRooms = () => {
    if (value === 'G' && floor) {
      return roomBlockG.filter(room => room.roomNumber.startsWith(`G${floor}`));
    } else if (value === 'I' && floor) {
      return roomBlockI.filter(room => room.roomNumber.startsWith(`I${floor}`));
    }
    return [];
  };

  const getIconColor = (availableSpots, totalSpots) => {
    const percentageAvailable = (availableSpots / 16) * 100;
    if (percentageAvailable >= 60) return 'green';
    if (percentageAvailable > 0) return 'yellow';
    return 'red';
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
                      <FormControlLabel value="I" control={<Radio />} label="Tòa I" />
                      <FormControlLabel value="G" control={<Radio />} label="Tòa G" />
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
                        <MenuItem key={floor} value={floor}>
                          {floor}
                        </MenuItem>
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
                        <MenuItem key={room.roomNumber} value={room.roomNumber}>
                          {`${room.roomNumber}`}
                          <CircleIcon sx={{ color: getIconColor(room.availableSpot), fontSize: 12, position: 'absolute', right: 10 }} />
                        </MenuItem>
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
