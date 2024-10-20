import React, { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { submitDormRoute, checkSubmit, getUserByIdRoute } from '../API/APIRouter';

import { useUser } from '../Context/Context';

import sucessImage from './images/sucess.png';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 700,
    alignItems: "center",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

export default function DormSubmit() {
    const settingId = "66e1a156ec541f415d9dc2be";
    const { userId } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [note, setNote] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    console.log('Toàn bộ phản hồi:', data); // In ra toàn bộ phản hồi
                    console.log('Kiểm tra đăng ký:', data.data.exists);
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
                    setUserInfo(response.data.data);
                } else {
                    console.error("Không tìm thấy thông tin người dùng.");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        checkRegistration();
        handleGetUserInfo(userId);
    }, [userId, settingId]);


    const handleSubmit = async () => {
        const response = await fetch(submitDormRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                note,
                settingId,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Đăng ký thành công:', data);
            setIsRegistered(true);
        } else {
            console.error('Đăng ký không thành công:', response.statusText);
        }
    };

    return (
        <div style={{ padding: '20px', marginLeft: '25px', position: 'relative', display: "flex", justifyContent: "center" }}>
            <DemoPaper square={false}>
                <h1>Đăng ký phòng KTX</h1>
                {loading ? (
                    <CircularIndeterminate />
                ) : isRegistered ? (
                    <div>
                        <img src={sucessImage} alt="Đăng ký thành công" style={{ width: '100px', height: '100px' }} />
                        <h2>Bạn đã đăng ký thành công!</h2>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {userInfo ? (
                            <>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Mã số sinh viên:</label>
                                    <label>{userInfo.userId}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Giới tính:</label>
                                    <label>{userInfo.gender}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Họ tên:</label>
                                    <label>{userInfo.name}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Lớp:</label>
                                    <label>{userInfo.class}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Địa chỉ:</label>
                                    <label>{userInfo.address}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Email:</label>
                                    <label>{userInfo.email}</label>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <label>Số điện thoại:</label>
                                    <label>{userInfo.phone}</label>
                                </div>
                            </>
                        ) : (
                            <p>Không tìm thấy thông tin người dùng.</p>
                        )}
                        <div>
                            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isRegistered}>Đăng ký</Button>
                        </div>
                    </div>
                )}
            </DemoPaper>
        </div>
    );
}

export function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
}
