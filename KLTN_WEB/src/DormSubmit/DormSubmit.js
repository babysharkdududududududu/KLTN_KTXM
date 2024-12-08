import React, { useEffect, useState } from "react";
import { Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { submitDormRoute, checkSubmit, getUserByIdRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import sucessImage from './images/sucess.png';
import { Phone, Email, Home, AccountCircle, Class } from '@mui/icons-material';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 700,
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export default function DormSubmit() {
    const settingId = "67428938405f93734ed214a0";
    const { userId } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [note, setNote] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(""); // Thêm trạng thái để lưu thông báo lỗi

    useEffect(() => {
        const checkRegistration = async () => {
            setLoading(true);
            try {
                const response = await fetch(checkSubmit, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        settingId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsRegistered(data.data.exists);
                } else {
                    console.error('Kiểm tra đăng ký không thành công:', response.statusText);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra đăng ký:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleGetUserInfo = async (userId) => {
            try {
                const response = await axios.get(`${getUserByIdRoute}${userId}`);
                if (response.data && response.data.data) {
                    const user = response.data.data;
                    setUserInfo(user);
                    setEmail(user.email);
                } else {
                    console.error("Không tìm thấy thông tin người dùng.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        checkRegistration();
        handleGetUserInfo(userId);
    }, [userId, settingId]);

    const handleSubmit = async () => {
        setErrorMessage(""); // Đặt lại thông báo lỗi khi gửi đăng ký
        const response = await fetch(submitDormRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                email,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setIsRegistered(true);
        } else {
            const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
            setErrorMessage("Bạn không đủ điều kiện để đăng ký."); // Cập nhật thông báo lỗi
            console.error('Đăng ký không thành công:', response.statusText);
        }
    };

    const handleCancelRegistration = async () => {
        setIsRegistered(false);
    };

    return (
        <div style={{ padding: '20px', display: "flex", justifyContent: "center" }}>
            <DemoPaper>
                <Typography variant="h4" gutterBottom>Đăng ký phòng KTX</Typography>
                {loading ? (
                    <CircularProgress />
                ) : isRegistered ? (
                    <div>
                        <img src={sucessImage} alt="Đăng ký thành công" style={{ width: '100px', height: '100px' }} />
                        <Typography variant="h6">Bạn đã đăng ký thành công!</Typography>
                        <StyledButton variant="contained" color="error" onClick={handleCancelRegistration}>
                            Hủy đăng ký
                        </StyledButton>
                    </div>
                ) : (
                    <Grid container spacing={2} direction="column">
                        {userInfo ? (
                            <>
                                <Grid item container alignItems="center">
                                    <AccountCircle style={{ marginRight: 5 }} />
                                    <Typography>Mã số sinh viên: {userInfo.userId}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <AccountCircle style={{ marginRight: 5 }} />
                                    <Typography>Giới tính: {userInfo.gender}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <AccountCircle style={{ marginRight: 5 }} />
                                    <Typography>Họ tên: {userInfo.name}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <Email style={{ marginRight: 5 }} />
                                    <Typography>Email: {userInfo.email}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <Class style={{ marginRight: 5 }} />
                                    <Typography>Lớp: {userInfo.class}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <Home style={{ marginRight: 5 }} />
                                    <Typography>Địa chỉ: {userInfo.address}</Typography>
                                </Grid>
                                <Grid item container alignItems="center">
                                    <Phone style={{ marginRight: 5 }} />
                                    <Typography>Số điện thoại: {userInfo.phone}</Typography>
                                </Grid>
                            </>
                        ) : (
                            <Typography>Không tìm thấy thông tin người dùng.</Typography>
                        )}
                        {errorMessage && ( // Hiển thị thông báo lỗi nếu có
                            <Typography color="error">{errorMessage}</Typography>
                        )}
                        <StyledButton variant="contained" color="primary" onClick={handleSubmit} disabled={isRegistered}>
                            Đăng ký
                        </StyledButton>
                    </Grid>
                )}
            </DemoPaper>
        </div>
    );
}
