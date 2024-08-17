import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Checkbox, FormControlLabel, Link, CircularProgress } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import styles from './Login.module.css';
import Divider from "@mui/material/Divider";
import ParticlesComponent from '../../Particles/Particle';
import ParticlesBackground from '../../Particles/ParticlesBackground';
import ForgotPassword from '../ForgotPasswordForm/ForgotPassword';
import Register from '../Register/Register';

const Login = ({ onLoginSuccess }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForgotPassword, setVisibleForgotPassword] = useState(false);
    const [visibleRegister, setVisibleRegister] = useState(false);

    //login
    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        // Kiểm tra định dạng email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Email không hợp lệ.');
            return;
        }

        setLoading(true);
        setError('');

        setTimeout(() => {
            if (email === 'a@gmail.com' && password === 'a') {
                onLoginSuccess();
                setError('');
            } else {
                setError('Email hoặc mật khẩu không đúng.');
            }
            setLoading(false);
        }, 1000);
    };
    //visible forgot password
    const handleForgotPassword = () => {
        setVisibleForgotPassword(!visibleForgotPassword);
    };
    //visible register
    const handleRegister = () => {
        setVisibleRegister(!visibleRegister);
    };
    const LoginForm = () => {
        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1, backgroundColor: 'white', borderRadius: 2, padding: 3 }}>
                <Typography variant="h4" gutterBottom color="primary">Đăng Nhập</Typography>
                <TextField label="Email" type="email" fullWidth margin="normal" name="email" InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập email của bạn" required />
                <TextField label="Mật khẩu" type="password" variant="outlined" fullWidth margin="normal" name="password" InputProps={{ startAdornment: <LockIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập mật khẩu của bạn" required />
                {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Nhớ mật khẩu" />
                <Link onClick={handleForgotPassword} variant="body2" sx={{ display: 'flex', marginTop: 1, justifyContent: "flex-end" }}> Quên mật khẩu?
                </Link>
                <Divider sx={{ margin: '16px 0' }} />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} className={`${styles.button} ${styles.hoverEffect}`}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Nhập'}
                </Button>
                <Link onClick={handleRegister} variant="body2" sx={{ display: 'block', marginTop: 2, textAlign: 'center' }}>Chưa có tài khoản? Đăng ký</Link>
            </Box>
        );
    }

    return (
        <div>
            <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
                <Box className={styles.box} sx={{ position: 'relative', overflow: 'hidden', padding: 2 }}>
                    <ParticlesComponent />
                    {
                        visibleForgotPassword ? <ForgotPassword onClose={handleForgotPassword} /> :
                            visibleRegister ? <Register onClose={handleRegister} /> :
                                <LoginForm />
                    }
                </Box>

            </Container>
        </div>
    );
};

export default Login;
