import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Select, MenuItem, Typography } from '@mui/material';

import DataTable from "./DataTable";
import BasicModal from './BasicModal';
import SucessfullModal from './SucessfullModal';
import RoomAssignment from './RoomAssignment'; // Import component mới
import { getSettingRoute, getBySettingId, getUserByIdRoute, autoAsignRoom, setAcceptedToWaitingPayment, pauseSettingRoute, openSettingRoute, getSettingIdRoute, exportDormSubmission, getSubmissionWithSettingIdAndUserId } from '../API/APIRouter';
import TimeLineStudent from "./TimeLineStudent";
import { useUser } from "../Context/Context";
import PauseSubmission from "./PauseSubmitsion";
import OpenRegistration from "./OpenRegistration"; // Import component mới
import OpenPayment from "./OpenPayment"; // Import component mới
import AutoAssignRoom from "./AutoAssignRoom"; // Import component mớ
import CustomizedMenus from "./CustomizedMenus";
import ClosePayment from "./ClosePayment";
import { set } from "date-fns";

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
    const [settingValue, setSettingValue] = useState('');
    const [openPauseDialog, setOpenPauseDialog] = useState(false);
    const [hasSubmit, setHasSubmit] = useState();
    const [openButton, setOpenButton] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpenPauseDialog = () => setOpenPauseDialog(true);
    const handleClosePauseDialog = () => setOpenPauseDialog(false);

    const [openOpenDialog, setOpenOpenDialog] = useState(false);

    const handleOpenOpenDialog = () => setOpenOpenDialog(true);
    const handleCloseOpenDialog = () => setOpenOpenDialog(false);

    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

    const handleOpenPaymentDialog = () => setOpenPaymentDialog(true);
    const handleClosePaymentDialog = () => setOpenPaymentDialog(false);

    const [openAutoAssignDialog, setOpenAutoAssignDialog] = useState(false);

    const handleOpenAutoAssignDialog = () => setOpenAutoAssignDialog(true);
    const handleCloseAutoAssignDialog = () => setOpenAutoAssignDialog(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //close payment
    const [statusPayment, setStatusPayment] = useState(false);
    const [openClosePaymentDialog, setOpenClosePaymentDialog] = useState(false);

    const handleOpenClosePaymentDialog = () => setOpenClosePaymentDialog(true);
    const handleCloseClosePaymentDialog = () => setOpenClosePaymentDialog(false);


    const handleOpenSucessfull = () => {
        setOpenSucessfull(true);
        setTimeout(() => {
            setOpenSucessfull(false);
        }, 2000);
    };
    const handleCloseSucessfull = () => setOpenSucessfull(false);

    const getPaymentStatus = async (setingID) => {
        try {
            const response = await axios.get(`${getPaymentStatusRoute}${setingID}`);
            if (response.data) {
                setStatusPayment(response.data.data);
            } else {
                console.error("Lỗi lấy trạng thái thanh toán:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy trạng thái thanh toán:", error);
        }
    };

    const handleChange = (event) => {
        setSetingID(event.target.value);
        getPaymentStatus(event.target.value);
        setSelectedStudent(null);
        setStatusID('');
        // set registrationStatus 
        const selectedSetting = setting.find((item) => item._id === event.target.value);
        if (selectedSetting) {
            setRegistrationStatus(selectedSetting.registrationStatus);
        }
    };

    const handlePausePayment = async () => {
        try {
            const response = await axios.patch(`${pausePaymentRoute}${setingID}`);
            if (response.data && response.data.data) {
                //
                setStatusPayment(false);
                handleOpenSucessfull(); // Hiển thị thông báo thành công
            } else {
                console.error("Lỗi tạm dừng thanh toán:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi tạm dừng thanh toán:", error);
        }
    }

    const handleExportData = async () => {
        try {
            // Tạo URL với cả settingID và statusID
            const url = `${exportDormSubmission}?settingId=${setingID}&status=${statusID}`;
            const response = await axios.get(url, {
                responseType: 'blob', // Đặt kiểu phản hồi là blob để xử lý file
            });

            // Lấy tên file từ header (nếu backend đã thiết lập)
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'dorm_submissions.xlsx'; // Tên mặc định nếu không tìm thấy

            if (contentDisposition && contentDisposition.includes('attachment')) {
                const matches = contentDisposition.match(/filename="?(.+)"?/);
                if (matches[1]) {
                    fileName = matches[1]; // Lấy tên file từ header
                }
            }

            // Tạo URL cho file tải về
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            // Tạo thẻ a để tải file
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', fileName); // Sử dụng tên file từ backend

            // Thêm thẻ a vào body và click để tải file
            document.body.appendChild(link);
            link.click();

            // Xóa thẻ a sau khi tải
            document.body.removeChild(link);
        } catch (error) {
            console.error("Có lỗi xảy ra khi xuất dữ liệu:", error);
        }
    };

    // API get submission with 
    const HasSubmit = async () => {
        try {
            const response = await axios.get(`${getSubmissionWithSettingIdAndUserId}${userId}`);
            if (response.status === 200 && response.data) {
                const submission = response.data.data;
                if (submission && Object.keys(submission).length > 0) {
                    setHasSubmit(submission);
                    setOpenButton(false);
                    setMessage('Bạn đã đăng ký phòng ở và đang chờ ban quản lý xét duyệt.');
                    console.log("Đã có đơn đăng ký:", submission);
                } else {
                    setHasSubmit(null);
                    setOpenButton(true);
                    console.log("Chưa có đơn đăng ký.");
                }
            } else {
                console.error("Lỗi lấy setting ID: Trạng thái không hợp lệ hoặc dữ liệu không tồn tại.");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy setting ID:", error.message);
            if (error.response) {
                console.error("Chi tiết lỗi từ server:", error.response.data);
            }
        }
    };

    useEffect(() => {
        HasSubmit();
    }, []);





    // Cập nhật hàm tạm dừng đăng ký
    const handlePause = async () => {
        try {
            const response = await axios.patch(`${pauseSettingRoute}${setingID}`);
            if (response.data && response.data.data) {
                setRegistrationStatus('paused');
                handleOpenSucessfull(); // Hiển thị thông báo thành công
            } else {
                console.error("Lỗi tạm dừng đăng ký:", response.data.message);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi tạm dừng đăng ký:", error);
        }
    }

    // Cập nhật hàm mở đăng ký
    const handleOpenRegistration = async () => {
        try {
            const response = await axios.patch(`${openSettingRoute}${setingID}`);
            if (response.data && response.data.data) {
                setRegistrationStatus('open');
                handleOpenSucessfull(); // Hiển thị thông báo thành công
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

    useEffect(() => {
        const handleGetSettingID = async () => {
            try {
                const response = await axios.get(getSettingIdRoute);
                if (response.data && response.data) {
                    setSettingValue(response.data.data);

                } else {
                    console.error("Lỗi lấy setting ID:", response.data.message);
                }
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy setting ID:", error);
            }
        };
        handleGetSettingID();
    }, [settingValue]);


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
            handleOpenSucessfull();
            const updatedStudentData = studentData.map(student => {
                if (student.status === 'ACCEPTED') {
                    return {
                        ...student,
                        status: 'ASSIGNED',
                        roomNumber: response.data.data[student.id],
                    };
                }
                return student;
            });
            setStudentData(updatedStudentData);
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
                handleOpenSucessfull();
                setStatusPayment(true);
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

                    {(roleId === 'USERS' && openButton) &&
                        (<Button variant="contained" disabled={!settingValue} color="primary" style={{ marginRight: '20px' }} onClick={submitDorm} >Đăng ký</Button>)
                    }
                    {
                        (roleId === 'USERS' && !openButton) &&
                        (<Typography style={{ color: 'red', fontSize: '16px', fontWeight: 'bold' }}>{message}</Typography>)
                    }
                    {roleId === 'MANAGER' && (
                        <>
                            <CustomizedMenus
                                roleId={roleId}
                                setingID={setingID}
                                registrationStatus={registrationStatus}
                                statusID={statusID}
                                submitDorm={submitDorm}
                                handleOpenPauseDialog={handleOpenPauseDialog}
                                handleOpenOpenDialog={handleOpenOpenDialog}
                                handleOpenAutoAssignDialog={handleOpenAutoAssignDialog}
                                handleOpenPaymentDialog={handleOpenPaymentDialog}
                                handleOpen={handleOpen}
                                handleExportData={handleExportData}
                                handleOpenClosePaymentDialog={handleOpenClosePaymentDialog}
                                statusPayment={statusPayment}
                            />
                        </>
                    )
                    }
                    {/* {roleId === 'MANAGER' && (<> <Button variant="contained" color="primary" onClick={handleOpen}>Cài đặt</Button></>)} */}
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
            {/* Truyền status history vào timelinestudent */}
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
            <PauseSubmission
                open={openPauseDialog}
                handleClose={handleClosePauseDialog}
                handlePause={handlePause}
            />
            <OpenRegistration
                open={openOpenDialog}
                handleClose={handleCloseOpenDialog}
                handleOpen={handleOpenRegistration}
            />
            <OpenPayment
                open={openPaymentDialog}
                handleClose={handleClosePaymentDialog}
                handleOpen={setAllAcceptedToWaitingPayment}
            />
            <AutoAssignRoom
                open={openAutoAssignDialog}
                handleClose={handleCloseAutoAssignDialog}
                handleAutoAssign={handleAutoAsignRoom}
            />
            <ClosePayment
                open={openClosePaymentDialog}
                handleClose={handleCloseClosePaymentDialog}
                handleOpen={handlePausePayment}
            />
        </div>
    );
};

export default ApproveRoom;
