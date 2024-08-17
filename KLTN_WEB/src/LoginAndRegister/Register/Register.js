import { Box, Button, TextField, Typography } from "@mui/material";
import ParticlesComponent from "../../Particles/Particle";
import styles from '../Register/Register.module.css';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onClose }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = emailOrPhone && username && password && confirmPassword
            && (otpSent ? otp : true)
            && otpSent; // Đảm bảo mã OTP đã được gửi
        setIsFormValid(isValid);
    }, [emailOrPhone, username, password, confirmPassword, otp, otpSent]);

    const handleSendOtp = () => {
        setOtpSent(true);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/home');

    };

    return (
        <Box className={styles.box}>
            <ParticlesComponent />
            <Box component="form" className={styles.form} onSubmit={handleRegister}>
                <Typography variant="h5" gutterBottom color="primary">Đăng Ký</Typography>

                <TextField label="Email hoặc Số Điện Thoại" type="text" fullWidth margin="normal" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập email hoặc số điện thoại" required />

                {
                    otpSent &&
                    (
                        <TextField label="Mã OTP" type="text" fullWidth margin="normal" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Nhập mã OTP" required />
                    )
                }

                <TextField label="Tên Đăng Nhập" type="text" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} InputProps={{ startAdornment: <PersonIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập tên đăng nhập" required />
                <TextField label="Mật Khẩu" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: <LockIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập mật khẩu của bạn" required />
                <TextField label="Xác Nhận Mật Khẩu" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} InputProps={{ startAdornment: <LockIcon sx={{ marginRight: 1 }} /> }} placeholder="Xác nhận mật khẩu của bạn" required />

                {
                    emailOrPhone && !otpSent &&
                    (
                        <Button type="button" variant="contained" color="primary" fullWidth className={`${styles.button} ${styles.hoverEffect}`} onClick={handleSendOtp} sx={{ marginBottom: 2 }}  >     Gửi Mã OTP </Button>
                    )
                }

                <Button type="submit" variant="contained" color="primary" fullWidth className={`${styles.button} ${styles.hoverEffect}`} disabled={!isFormValid} sx={{ marginBottom: 2 }}> Đăng Ký</Button>
                <Button variant="text" color="secondary" onClick={onClose} fullWidth> Đóng</Button>
            </Box>
        </Box>
    );
};

export default Register;
