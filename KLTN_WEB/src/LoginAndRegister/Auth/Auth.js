import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import styles from './Auth.module.css'; // Đường dẫn đến file CSS module của bạn
import axios from 'axios'; // Thêm axios để gửi yêu cầu HTTP

import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Giả sử id được truyền vào từ trang đăng ký
    const id = "66c141d3fa2c6c832f0ebb4e"; // Thay thế bằng id thực tế khi có

    const handleVerification = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/api/v1/auth/check-code', {
                _id: id,
                code: verificationCode
            });

            if (response.data.success) {
                // Xử lý thành công
                setSuccess(true);
                setError('');
                navigate('/login');
                // Chuyển hướng hoặc thông báo thành công
            } else {
                setError('Mã xác thực không hợp lệ.');
                setSuccess(false);
            }
        } catch (error) {
            console.error("Lỗi xác thực", error);
            setError('Lỗi xác thực. Vui lòng thử lại.');
            navigate('/');

            setSuccess(false);
        }
    };

    return (
        <Box className={styles.box}>
            <Box component="form" className={styles.form} onSubmit={handleVerification}>
                <Typography variant="h4" gutterBottom color="primary">
                    Xác Thực Email
                </Typography>

                <TextField
                    label="Mã Xác Thực"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Nhập mã xác thực"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={`${styles.button} ${styles.hoverEffect}`}
                    sx={{ marginBottom: 2 }}>
                    Xác Thực
                </Button>

                {success && <Typography color="success">Xác thực thành công!</Typography>}
                {error && <Typography color="error">{error}</Typography>}
            </Box>
        </Box>
    );
};

export default Auth;
