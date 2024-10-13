import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Select, MenuItem, Typography } from '@mui/material';

import DataTable from "./DataTable";
import BasicModal from './BasicModal';
import SucessfullModal from './SucessfullModal';
import InfoDetail from "./InfoDetail";
import { useUser } from "../Context/Context";
import TimeLineStudent from "./TimeLineStudent";

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
    const [studentData, setStudentData] = useState([]);
    const [filteredStudentData, setFilteredStudentData] = useState([]);
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statusID, setStatusID] = useState('');
    const { roleId } = useUser();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenSucessfull = () => {
        setOpenSucessfull(true);
        setTimeout(() => {
            setOpenSucessfull(false);
        }, 2000);
    };

    const handleChange = (event) => {
        setSetingID(event.target.value);
        setSelectedStudent(null);
        setStatusID('');
    };

    const handleChangeStatus = (event) => {
        setStatusID(event.target.value);
    };

    // Fetch API data for settings
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

    // Fetch student data based on setting ID
    useEffect(() => {
        const fetchData = async () => {
            if (!setingID) return;

            try {
                const response = await fetch(`${getBySettingId}/${setingID}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

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
                        status: submission.status || 'Chưa xác định',
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

        fetchData();
    }, [setingID]);

    // Filter student data based on status
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
        try {
            const response = await axios.post(autoAsignRoom, {
                settingId: setingID,
            });
            if (response.data && response.data.data) {
                console.log("Xếp phòng thành công:", response.data.data);
                handleOpenSucessfull();
            } else {
                console.error("Lỗi xếp phòng:", response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi xếp phòng:", error);
        }
    };

    return (
        <div style={{ padding: '20px', marginLeft: '25px', position: 'relative' }}>
            <BasicModal setingID={setingID} open={open} handleClose={handleClose} handleOpenSucessfull={handleOpenSucessfull} />
            <SucessfullModal open={openSucessfull} handleClose={() => setOpenSucessfull(false)} />

            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                {roleId !== 'USERS' && (
                    <>
                        <Typography variant="h6" style={{ flex: 1 }}>Danh sách đơn đăng ký</Typography>
                        <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
                            <Select
                                value={setingID}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{ height: 35, width: 180 }}
                            >
                                {setting.map(item => (
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
                                {statuses.map(status => (
                                    <MenuItem key={status.id} value={status.id} sx={{ width: 180 }}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}

                <div style={{ height: "50px", alignItems: 'center', display: 'flex', marginLeft: "10px" }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={submitDorm} disabled={!setingID}>Đăng ký</Button>
                    {setingID && statusID === 'PAID' && roleId !== 'USERS' && (
                        <Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={handleAutoAsignRoom}>
                            Tự động xếp phòng
                        </Button>
                    )}
                    {setingID === '' && roleId !== 'USERS' && (
                        <Button variant="contained" color="primary" onClick={handleOpen}>Cài đặt</Button>
                    )}
                </div>
            </div>

            {setingID && roleId !== 'USERS' && (
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: '10px' }}>
                    <DataTable studentData={filteredStudentData} handleRowClick={handleRowClick} />
                    <InfoDetail student={selectedStudent} />
                </div>
            )}

            {roleId === 'USERS' && (
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: '10px' }}>
                    <TimeLineStudent />
                </div>
            )}
        </div>
    );
};

export default ApproveRoom;
