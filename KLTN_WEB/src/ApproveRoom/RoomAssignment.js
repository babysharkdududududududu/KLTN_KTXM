import React, { useState, useEffect } from 'react';
import { Typography, Button, Divider, FormControl, FormLabel, RadioGroup, Radio, MenuItem, Select } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { getAllRoomRoute, updateStatusRoomAssigned, getRoomByIdRoute, changeRoomRoute } from '../API/APIRouter';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StudentTable from './StudentTable';

import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';

const RoomAssignment = ({ studentData, handleOffAssignRoom, updateStudentData }) => {
    // Khai báo state
    const [value, setValue] = useState('blockI');
    const [room, setRoom] = useState(studentData.roomNumber ? studentData.roomNumber : '');
    const [floor, setFloor] = useState('');
    const [showRoomSelection, setShowRoomSelection] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [assignSuscess, setAssignSuscess] = useState(studentData.status === 'ASSIGNED');
    const [studentList, setStudentList] = useState([]);
    const [floorBlockG, setFloorBlockG] = useState([]);
    const [roomBlockG, setRoomBlockG] = useState([]);
    const [floorBlockI, setFloorBlockI] = useState([]);
    const [roomBlockI, setRoomBlockI] = useState([]);
    const [currentRoomNumber, setCurrentRoomNumber] = useState(studentData.roomNumber); 
    console.log(studentData);
    // Lấy danh sách phòng khi component được mount
    useEffect(() => {
        const getAllRooms = async () => {
            try {
                const response = await axios.get(getAllRoomRoute);
                const results = response.data.data.results;

                setRoomList(results);
                const floorBlockG = [...new Set(results.filter((room) => room.block === 'G').map((room) => room.floor))];
                const roomBlockG = results.filter((room) => room.block === 'G').map((room) => ({
                    roomNumber: room.roomNumber,
                    availableSpot: room.availableSpot
                }));

                setFloorBlockG(floorBlockG);
                setRoomBlockG(roomBlockG);

                const floorBlockI = [...new Set(results.filter((room) => room.block === 'I').map((room) => room.floor))];
                const roomBlockI = results.filter((room) => room.block === 'I').map((room) => ({
                    roomNumber: room.roomNumber,
                    availableSpot: room.availableSpot
                }));

                setFloorBlockI(floorBlockI);
                setRoomBlockI(roomBlockI);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phòng:', error);
            }
        };

        getAllRooms();
    }, []); // Chỉ gọi một lần khi component được mount

    // Sử dụng useEffect để thiết lập giá trị khi studentData thay đổi
    useEffect(() => {
        if (studentData) {
            setValue(studentData.gender === '1' ? 'blockI' : 'blockG');
            setRoom('');
            setFloor('');
            setShowRoomSelection(false);
        }
    }, [studentData]);

    useEffect(() => {
        if (room) {
            const getRoom = async () => {
                try {
                    const response = await axios.get(`${getRoomByIdRoute}${room}`);
                    setStudentList(response.data.data.room.users);
                    console.log(response.data.data.room.users);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách phòng:', error);
                }
            };
            getRoom();
        }
    }, [room, assignSuscess, currentRoomNumber]);


    // Kiểm tra nếu studentData không tồn tại
    if (!studentData) {
        return <Typography variant="body1">Không có dữ liệu sinh viên.</Typography>;
    }

    // Xử lý thay đổi tòa nhà
    const handleChange = (event) => {
        setValue(event.target.value);
        setFloor('');
        setRoom('');
    };

    // Xử lý thay đổi tầng
    const handleChangeFloor = (event) => {
        setFloor(event.target.value);
        setRoom('');
    };

    // Xử lý thay đổi phòng
    const handleChangeRoom = (event) => {
        setRoom(event.target.value);
    };

    // Lấy danh sách tầng theo tòa nhà
    const getFloors = () => {
        return value === 'G' ? floorBlockG : floorBlockI;
    };

    // Lấy danh sách phòng theo tầng
    const getRooms = () => {
        if (value === 'G' && floor) {
            return roomBlockG.filter(room => room.roomNumber.startsWith(`G${floor}`));
        } else if (value === 'I' && floor) {
            return roomBlockI.filter(room => room.roomNumber.startsWith(`I${floor}`));
        }
        return [];
    };

    // Lấy màu sắc biểu tượng dựa trên số chỗ trống
    const getIconColor = (availableSpots) => {
        const percentageAvailable = (availableSpots / 16) * 100;
        if (percentageAvailable >= 60) return 'green';
        if (percentageAvailable > 0) return 'yellow';
        return 'red';
    };

    const handleAssignRoom = async () => {
        try {
            const response = await fetch(`${updateStatusRoomAssigned}/${studentData.submitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomNumber: room }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            setAssignSuscess(true);
            setCurrentRoomNumber(room);
            updateStudentData({ ...studentData, status: 'ASSIGNED', roomNumber: room });
        } catch (error) {
            console.error('Lỗi khi xếp phòng:', error);
        }
    };

    const changeRoom = async () => {
        try {
            const response = await fetch(`${changeRoomRoute}/${studentData.submitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomNumber: room }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            setAssignSuscess(true);
            setCurrentRoomNumber(room);
            updateStudentData({ ...studentData, status: 'ASSIGNED', roomNumber: room });
        } catch (error) {
            console.error('Lỗi khi xếp phòng:', error); 
        }
    }

    return (
        <div style={{ width: "100%", paddingLeft: "16px", paddingRight: "16px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Button variant="contained" color="primary" onClick={handleOffAssignRoom} sx={{ height: '35px', marginRight: '10px' }}> Quay lại</Button>
                <CustomSeparator handleOffAssignRoom={handleOffAssignRoom} />
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: "row", width: "100%" }}>
                <div style={{ width: "50%" }}>
                    <label style={{ fontSize: 17, fontWeight: "bold" }}>THÔNG TIN SINH VIÊN</label>
                    <div style={{ marginTop: 10 }}>
                        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', marginBottom: 10}}>
                            <AssignmentIcon style={{ marginRight: 5 }} />
                            MSSV: {studentData.id}
                        </Typography>
                        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <AccountCircleIcon style={{ marginRight: 5 }} />
                            Họ và tên: {studentData.fullName}
                        </Typography>
                        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <PhoneIcon style={{ marginRight: 5 }} />
                            Số điện thoại: {studentData.phoneNumber}
                        </Typography>
                        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <HomeIcon style={{ marginRight: 5 }} />
                            Địa chỉ: {studentData.address}
                        </Typography>
                        <Typography variant="body1" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <HomeIcon style={{ marginRight: 5 }} />
                            Phòng: {currentRoomNumber === "NaN" ? "Chưa có phòng" : currentRoomNumber}
                        </Typography>
                    </div>
                </div>


                <div style={{ flexDirection: 'row', width: "50%", paddingLeft: "10px", paddingRight: "10px" }}>
                    {(studentData.status === 'PAID' || showRoomSelection || studentData.status == 'ASSIGNED') && (
                        <>
                            <div style={{ marginTop: 10 }}>
                                <label style={{ fontSize: 17, fontWeight: "bold" }}>CHỌN PHÒNG</label>
                                <div style={{ marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <FormControl>
                                        <FormLabel>Tòa nhà</FormLabel>
                                        <RadioGroup value={value} onChange={handleChange}>
                                            <FormControlLabel value="I" control={<Radio />} label="Tòa I" />
                                            <FormControlLabel value="G" control={<Radio />} label="Tòa G" />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl sx={{ width: 200 }}>
                                        <FormLabel>Tầng</FormLabel>
                                        <Select value={floor} onChange={handleChangeFloor} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
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
                                    <FormControl sx={{ width: 200 }}>
                                        <FormLabel>Phòng</FormLabel>
                                        <Select value={room} onChange={handleChangeRoom} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
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
                    <div style={{ marginTop: "20px" }}>
                        <StudentTable studentList={studentList} studentDataID = {studentData.id} />
                    </div>
                    <div style={{ marginTop: "20px", width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        {assignSuscess && (
                            <Typography sx={{ color: 'success.main', marginRight: "20px" }}>
                                Sinh viên này đã được xếp phòng
                            </Typography>
                        )}
                        {!assignSuscess && (
                            <Button
                                variant="contained"
                                color="success"
                                disabled={!room}
                                onClick={handleAssignRoom}
                            >
                                XÁC NHẬN
                            </Button>
                        )}
                        {studentData.status === 'ASSIGNED' && studentData.roomNumber !== room && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={!room}
                                    onClick={() => {
                                        changeRoom();
                                        setAssignSuscess(true);
                                    }}
                                    style={{ marginLeft: "20px" }}
                                >
                                    Đổi phòng
                                </Button>
                            )
                        }
                    </div>

                </div>

            </div>
        </div>
    );
};

export default RoomAssignment;

export function CustomSeparator({ handleOffAssignRoom }) {
    const breadcrumbs = [
        <Link
            underline="hover"
            key="2"
            color="inherit"
            onClick={handleOffAssignRoom}
            style={{ cursor: 'pointer' }}
        >
            Đăng ký phòng
        </Link>,
        <Typography key="3" sx={{ color: 'text.primary' }}>
            Xếp phòng
        </Typography>,
    ];

    return (
        <Stack spacing={2}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
        </Stack>
    );
}