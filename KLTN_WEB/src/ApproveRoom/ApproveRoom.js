import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Select, MenuItem, Typography } from '@mui/material';

import DataTable from "./DataTable";
import BasicModal from './BasicModal';
import SucessfullModal from './SucessfullModal';
import InfoDetail from "./InfoDetail";

import { getSettingRoute, getBySettingId, getUserByIdRoute, autoAsignRoom } from '../API/APIRouter';

const statuses = [
    { id: '', name: 'Tất cả' },
    { id: 'PENDING', name: 'Chờ xử lý' },
    { id: 'ACCEPTED', name: 'Đã chấp nhận' },
    { id: 'AWAITING_PAYMENT', name: 'Chờ thanh toán' },
    { id: 'PAID', name: 'Đã thanh toán' },
    { id: 'ASSIGNED', name: 'Đã xếp phòng' },
    { id: 'REJECTED', name: 'Từ chối đơn đăng ký' },
];

const ApproveRoom = () => {
    const [open, setOpen] = useState(false);
    const [setingID, setSetingID] = useState('');
    const [setting, setSetting] = useState([]);
    const [openSucessfull, setOpenSucessfull] = useState(false);
    const [dormSubmitList, setDormSubmitList] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [filteredStudentData, setFilteredStudentData] = useState([]);
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statusID, setStatusID] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenSucessfull = () => {
        setOpenSucessfull(true);
        setTimeout(() => {
            setOpenSucessfull(false);
        }, 2000);
    };
    const handleCloseSucessfull = () => setOpenSucessfull(false);

    const handleChange = (event) => {
        setSetingID(event.target.value);
        setSelectedStudent(null);
        setStatusID('');
    };

    const handleChangeStatus = (event) => {
        setStatusID(event.target.value);
    };

    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getSettingRoute);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSetting(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const updateStudentData = (updatedStudent) => {
        setStudentData((prevData) =>
            prevData.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
            )
        );
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${getBySettingId}/${setingID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDormSubmitList(data.data);

                const studentPromises = data.data.map(async (submission) => {
                    const studentResponse = await fetch(`${getUserByIdRoute}${submission.userId}`);
                    if (!studentResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const studentData = await studentResponse.json();
                    return {
                        id: submission.userId,
                        fullName: studentData.data ? studentData.data.name : 'Không xác định',
                        phoneNumber: studentData.data ? studentData.data.phone : 'Không xác định',
                        address: studentData.data ? studentData.data.address : 'Không xác định',
                        roomNumber: submission.roomNumber || 'N/A',
                        action: 'Xem',
                        gender: studentData.data ? studentData.data.gender : 'Không xác định',
                        email: studentData.data ? studentData.data.email : 'Không xác định',
                        status: submission.status ? submission.status : 'Chưa xác định',
                        submitId: submission._id,
                    };
                });

                const students = await Promise.all(studentPromises);
                setStudentData(students);
                setFilteredStudentData(students);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (setingID) {
            fetchData();
        }
    }, [setingID]);

    useEffect(() => {
        const filteredData = studentData.filter(student => {
            return statusID === '' || student.status === statusID;
        });
        setFilteredStudentData(filteredData);
    }, [statusID, studentData]);


    const submitDorm = () => {
        navigate('/dorm-submit');
    };

    const handleRowClick = (student) => {
        setSelectedStudent(student);
    };
    
    const handleAutoAsignRoom = async () => {
        const response = await axios.post(autoAsignRoom, {
            settingId: setingID,
        });
        if (response.data && response.data.data) {
            console.log("Xếp phòng thành công:", response.data.data);
        } else {
            console.error("Lỗi xếp phòng:", response.data.message);
        }
    };

    return (
        <div style={{ padding: '20px', marginLeft: '25px', position: 'relative' }}>
            
            <BasicModal setingID={setingID} open={open} handleClose={handleClose} handleOpenSucessfull={handleOpenSucessfull} />
            
            <SucessfullModal open={openSucessfull} handleClose={handleCloseSucessfull} />
            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                <Typography variant="h6" style={{ flex: 1 }}>Danh sách đơn đăng ký</Typography>

                <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
                    <Select
                        value={setingID}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: 35, width: 180 }}
                    >
                        {setting.map((item) => (
                            <MenuItem key={item._id} value={item._id} sx={{ width: 180 }}>
                                {item.name}
                            </MenuItem>
                        ))}
                        <MenuItem value="">
                            <em>Tạo mới</em>
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <Select
                        value={statusID}
                        onChange={handleChangeStatus}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: 35, width: 180 }}
                    >
                        {statuses.map((status) => (
                            <MenuItem key={status.id} value={status.id} sx={{ width: 180 }}>
                                {status.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div style={{ height: "50px", alignItems: 'center', display: 'flex', marginLeft: "10px" }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={submitDorm} disabled={!setingID}>Đăng ký</Button>
                    {setingID !== '' && statusID === 'PAID' && (
                        <Button variant="contained" color="primary" style={{ marginRight: '20px' }} disabled={!setingID} onClick={handleAutoAsignRoom}>
                            Tự động xếp phòng
                        </Button>
                    )}
                    {setingID == '' && (
                        <Button variant="contained" color="primary" onClick={handleOpen}>Cài đặt</Button>
                    )}
                </div>
            </div>

            {setingID && (
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: '10px' }}>
                    <DataTable studentData={filteredStudentData} handleRowClick={handleRowClick} />
                    <InfoDetail student={selectedStudent} updateStudentData={updateStudentData} />
                </div>
            )}
        </div>
    );
};

export default ApproveRoom;
