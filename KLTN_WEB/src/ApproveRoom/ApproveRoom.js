import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Select, MenuItem, Typography } from '@mui/material';

import DataTable from "./DataTable";
import BasicModal from './BasicModal';
import SucessfullModal from './SucessfullModal';
import RoomAssignment from './RoomAssignment'; // Import component mới
import { getSettingRoute, getBySettingId, getUserByIdRoute, autoAsignRoom, setAcceptedToWaitingPayment, pauseSettingRoute, openSettingRoute } from '../API/APIRouter';
import TimeLineStudent from "./TimeLineStudent";
import { useUser } from "../Context/Context";

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
    const [registrationStatus, setRegistrationStatus] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [filteredStudentData, setFilteredStudentData] = useState([]);
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statusID, setStatusID] = useState('');
    const { userId, roleId } = useUser();

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
        // set registrationStatus 
        const selectedSetting = setting.find((item) => item._id === event.target.value);
        if (selectedSetting) {
            setRegistrationStatus(selectedSetting.registrationStatus);
        }
    };

    const handlePauseRegistration = async () => {
        try {
            const response = await axios.patch(`${pauseSettingRoute}${setingID}`);
            if (response.data && response.data.data) {
                setRegistrationStatus('paused');
            } else {
                console.error("Lỗi tạm dừng đăng ký:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi tạm dừng đăng ký:", error);
        }
    };

    const handleOpenRegistration = async () => {
        try {
            const response = await axios.patch(`${openSettingRoute}${setingID}`);
            if (response.data && response.data.data) {
                setRegistrationStatus('open');
            } else {
                console.error("Lỗi mở đăng ký:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi mở đăng ký:", error);
        }

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

    const [openDetail, setOpenDetail] = useState(false);
    const handleAssignRoom = (student) => {
        setSelectedStudent(student)
        setOpenDetail(true);
    };
    const handleOffAssignRoom = () => {
        setOpenDetail(false);
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

    // Chuyển tất cả đơn đã chấp nhận sang chờ thanh toán
    const setAllAcceptedToWaitingPayment = async () => {
        try {
            const response = await axios.patch(`${setAcceptedToWaitingPayment}/${setingID}`, {
                // Không cần truyền settingId trong body nữa
            });

            if (response.data && response.data.data) {

                // Cập nhật lại bảng
                const updatedStudentData = studentData.map(student => {
                    // Kiểm tra trạng thái và cập nhật
                    if (student.status === 'ACCEPTED') {
                        return {
                            ...student,
                            status: 'AWAITING_PAYMENT',
                        };
                    }
                    return student;
                });

                // Cập nhật state với dữ liệu đã thay đổi
                setStudentData(updatedStudentData);
            } else {
                console.error("Lỗi chuyển tất cả sang chờ thanh toán:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi chuyển tất cả sang chờ thanh toán:", error);
        }
    };


    return (
        <div style={{ padding: '20px', marginLeft: '25px', position: 'relative' }}>

            <BasicModal setingID={setingID} open={open} handleClose={handleClose} handleOpenSucessfull={handleOpenSucessfull} />

            <SucessfullModal open={openSucessfull} handleClose={handleCloseSucessfull} text="Cài đặt đăng ký thành công" />
            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                <Typography variant="h6" style={{ flex: 1 }}></Typography>

                {
                    roleId === 'MANAGER' && (
                        <>
                            <FormControl sx={{ minWidth: 120, marginRight: 3 }}>
                                <Select value={setingID} onChange={handleChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }} sx={{ height: 35, width: 180 }}>
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
                                <Select value={statusID} onChange={handleChangeStatus} displayEmpty inputProps={{ 'aria-label': 'Without label' }} sx={{ height: 35, width: 180 }}>
                                    {statuses.map((status) => (
                                        <MenuItem key={status.id} value={status.id} sx={{ width: 180 }}> {status.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}

                <div style={{ height: "50px", alignItems: 'center', display: 'flex', marginLeft: "10px" }}>

                    {roleId === 'USERS' &&
                        (<Button variant="contained" color="primary" style={{ marginRight: '20px' }} onClick={submitDorm} >Đăng ký</Button>)
                    }
                    {roleId === 'MANAGER' && (
                        <>
                            {setingID !== '' && registrationStatus === 'open' && (
                                <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handlePauseRegistration}>
                                    Tạm dừng đăng ký
                                </Button>
                            )}
                            {setingID !== '' && registrationStatus === 'paused' && (
                                <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleOpenRegistration}>
                                    Mở đăng ký
                                </Button>
                            )}
                            {setingID !== '' && statusID === 'PAID' && (
                                <Button variant="contained" color="primary" style={{ marginRight: '20px' }} disabled={!setingID} onClick={handleAutoAsignRoom}>
                                    Tự động xếp phòng
                                </Button>
                            )}
                            {setingID !== '' && statusID === 'ACCEPTED' && (
                                <Button variant="contained" color="primary" style={{ marginRight: '20px' }} disabled={!setingID} onClick={setAllAcceptedToWaitingPayment}>
                                    Mở thanh toán
                                </Button>
                            )}
                        </>
                    )
                    }
                    {roleId === 'MANAGER' && (<> <Button variant="contained" color="primary" onClick={handleOpen}>Cài đặt</Button></>)}
                </div>
            </div>
            {roleId === 'MANAGER' && (
                <>
                    {!openDetail && (
                        <div style={{ width: '100%', height: '65px', display: "flex", flexDirection: "row", backgroundColor: "#fff", borderRadius: 15, justifyContent: 'space-around', alignItems: 'center' }}>
                            <div>
                                <Typography style={{ color: '#464f43' }}>Tổng đơn đăng ký</Typography>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{filteredStudentData.length}</Typography>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Chờ xử lý</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'PENDING').length}</Typography>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Đã chấp nhận</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'ACCEPTED').length}</Typography>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Chờ thanh toán</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'AWAITING_PAYMENT').length}</Typography>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Đã thanh toán</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'PAID').length}</Typography>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Đã xếp phòng</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'ASSIGNED').length}</Typography>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                                <div>
                                    <Typography style={{ color: '#464f43' }}>Từ chối</Typography>
                                    <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{filteredStudentData.filter(student => student.status === 'REJECTED').length}</Typography>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }
            {roleId === 'USERS' && (<TimeLineStudent />)}

            {setingID && (
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "center", marginTop: '10px', backgroundColor: "#fff", borderRadius: 20, paddingTop: '10px' }}>
                    {!openDetail && (
                        <DataTable
                            studentData={filteredStudentData}
                            handleRowClick={handleRowClick}
                            handleAssignRoom={handleAssignRoom}
                            updateStudentData={updateStudentData}
                        />
                    )}
                    {openDetail && selectedStudent && (
                        <RoomAssignment studentData={selectedStudent} handleOffAssignRoom={handleOffAssignRoom} onBack={() => setOpenDetail(false)} updateStudentData={updateStudentData} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ApproveRoom;
