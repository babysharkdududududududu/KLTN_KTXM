import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllUserRoute, createDisciplineRoute, getRoomRoute } from "../API/APIRouter";
import { Box, Tabs, Tab, Typography } from '@mui/material';
import StudentList from './StudentList';
import RoomStudents from './RoomStudents';
import ViolationModal from './ViolationModal';
import EditViolationModal from './EditViolationModal';

const Discipline = () => {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [newViolationDate, setNewViolationDate] = useState('');
    const [violationType, setViolationType] = useState('Giờ giấc');
    const [listRooms, setListRooms] = useState([]);
    const [listStudents, setListStudents] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const pageSize = 10;

    // Fetch rooms and group students by room
    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute, { params: { all: true } });
            const rooms = data.data.results;
            const userResponse = await axios.get(getAllUserRoute);
            if (!userResponse.data || !userResponse.data.data) {
                throw new Error('Không có dữ liệu người dùng');
            }
            const usersWithViolations = userResponse.data.data.map(user => {
                const totalViolationCount = user.disciplines.reduce((acc, discipline) => { return acc + discipline.violationCount; }, 0);
                return {
                    ...user,
                    violationCount: totalViolationCount
                };
            });

            const groupedStudents = rooms.reduce((acc, room) => {
                if (room.users && room.users.length > 0) {
                    acc[room.roomNumber] = room.users.map(user => {
                        const violationData = usersWithViolations.find(u => u._id === user._id);
                        console.log("Checking match for:", { userId: user._id, found: violationData });
                        return {
                            ...user,
                            roomNumber: room.roomNumber,
                            violationCount: violationData ? violationData.violationCount : 0,
                            disciplines: violationData ? violationData.disciplines : user.disciplines || []
                        };
                    });
                }
                return acc;
            }, {});
            setListRooms(rooms);
            setListStudents(groupedStudents);
        } catch (err) {
            console.error("Error fetching rooms and users:", err);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    // Fetch all users and update violation counts
    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            if (response.data && response.data.data) {
                const users = response.data.data.map(user => {
                    const totalViolationCount = user.disciplines.reduce((acc, discipline) => {
                        return acc + discipline.violationCount;
                    }, 0);

                    return {
                        ...user,
                        violationCount: totalViolationCount
                    };
                });
                setUserData(users);
            } else {
                console.error('Invalid data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        handleGetAllUser();
    }, []);

    const filteredUsers = userData.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const columns = [
        { field: 'userId', headerName: 'User ID', flex: 1 },
        { field: 'name', headerName: 'Tên', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Điện thoại', flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', flex: 1 },
        { field: 'faculty', headerName: 'Khoa', flex: 1 },
        { field: 'class', headerName: 'Lớp', flex: 1 },
        {
            field: 'violationCount',
            headerName: 'Số lần vi phạm',
            flex: 1,
            renderCell: (params) => {
                let color;
                const count = params.value;

                if (count === 0) { color = 'green'; }
                else if (count >= 1 && count <= 3) { color = 'orange'; }
                else if (count === 4) { color = 'red'; }
                else { color = 'black'; }

                return (<Typography sx={{ color, fontWeight: 'bold' }}> {count} </Typography>);
            }
        },
    ];

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
        setNewDescription('');
        setNewViolationDate('');
        setViolationType('Giờ giấc');
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setOpenEditModal(false);
    };

    // Update violation count and save the violation
    const handleSaveViolation = async () => {
        if (!newDescription || !newViolationDate) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        const descriptionData = {
            content: newDescription,
            violationDate: newViolationDate,
            violationType: violationType,
        };
        const createDisciplineData = {
            userId: selectedUser.userId,
            violationDate: newViolationDate,
            penalty: "Cảnh cáo",
            descriptions: [descriptionData]
        };

        try {
            // Save violation
            const response = await axios.post(createDisciplineRoute, createDisciplineData);
            console.log("Vi phạm đã được lưu:", response.data);

            // Update violation count in userData
            const updatedUserData = userData.map(user => {
                if (user.userId === selectedUser.userId) {
                    user.violationCount += 1;  // Increment violation count
                }
                return user;
            });

            // Update listStudents with the new violation count
            const updatedListStudents = { ...listStudents };
            Object.keys(updatedListStudents).forEach(roomNumber => {
                updatedListStudents[roomNumber] = updatedListStudents[roomNumber].map(student => {
                    if (student.userId === selectedUser.userId) {
                        student.violationCount += 1;  // Increment violation count for this student in the room
                    }
                    return student;
                });
            });

            setUserData(updatedUserData);
            setListStudents(updatedListStudents);  // Update listStudents to trigger re-render

            handleGetAllUser();
            handleCloseModal();
        } catch (error) {
            console.error('Lỗi khi lưu thông tin vi phạm:', error);
        }
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
            {/* <Tabs value={tabValue} onChange={handleChangeTab} sx={{ mb: 2 }}>
                <Tab label="Danh sách sinh viên" />
                <Tab label="Sinh viên theo phòng" />
            </Tabs> */}

            {/* {tabValue === 0 && (
                <StudentList
                    paginatedUsers={paginatedUsers}
                    columns={columns}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSelectedUser={setSelectedUser}
                />
            )} */}

            {/* {tabValue === 1 && ( */}
            <RoomStudents
                listStudents={listStudents}
                columns={columns}
                setSelectedUser={setSelectedUser}
            />
            {/* )} */}

            <ViolationModal
                selectedUser={selectedUser}
                handleOpenEditModal={handleOpenEditModal}
                handleCloseModal={handleCloseModal}
            />

            <EditViolationModal
                openEditModal={openEditModal}
                handleCloseModal={handleCloseModal}
                newDescription={newDescription}
                setNewDescription={setNewDescription}
                newViolationDate={newViolationDate}
                setNewViolationDate={setNewViolationDate}
                violationType={violationType}
                setViolationType={setViolationType}
                handleSaveViolation={handleSaveViolation}
            />
        </Box>
    );
};

export default Discipline;
