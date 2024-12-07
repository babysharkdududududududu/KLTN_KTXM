import { Lock as LockIcon } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import { Alert, Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from 'react';
import ForgotPassword from '../ForgotPasswordForm/ForgotPassword';
import Register from '../Register/Register';
import styles from './Login.module.css';
import axios from 'axios';
import { useUser } from '../../Context/Context';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Lottie from 'lottie-react';
import buildAnimation from './asset/buildingv2.json';
import logo from './asset/iuh.png';
import ParticlesComponent from '../../Particles/ParticlesBackground';
import { loginRoute } from '../../API/APIRouter';
// import loadingAnimation from './asset/loading.json';
import { useContext } from 'react';

import ReactDOM from 'react-dom'
import Snowfall from 'react-snowfall'
import SpringFlowers from '../../AnimCursor/Spring';




const Login = ({ onLoginSuccess }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForgotPassword, setVisibleForgotPassword] = useState(false);
    const [visibleRegister, setVisibleRegister] = useState(false);
    const { setRoleId, setUserId } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    // const [loadingAnimationVisible, setLoadingAnimationVisible] = useState(false);

    // State for logo opacity and position
    const [logoOpacity, setLogoOpacity] = useState(0);
    const [logoPosition, setLogoPosition] = useState(100);

    // API login
    // const handleLogin = async (event) => {
    //     event.preventDefault();
    //     const email = event.target.email.value;
    //     const password = event.target.password.value;
    //     setLoading(true);
    //     setError('');

    //     try {
    //         const response = await axios.post(loginRoute, {
    //             username: email,
    //             password: password
    //         });
    //         const { role, userId } = response.data.data.user;
    //         const token = response.data.data.access_token;

    //         localStorage.setItem('email', email);
    //         localStorage.setItem('role', role);
    //         localStorage.setItem('userId', userId);
    //         localStorage.setItem('token', token);

    //         setRoleId(role);
    //         setUserId(userId);
    //         onLoginSuccess();
    //     } catch (error) {
    //         console.error("Đăng nhập thất bại", error);
    //         setError('Email hoặc mật khẩu không đúng.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(loginRoute, {
                username: email,
                password: password
            });
            const { role, userId } = response.data.data.user;
            const token = response.data.data.access_token;

            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);
            localStorage.setItem('token', token);

            setRoleId(role);
            setUserId(userId);

            // Hiển thị hiệu ứng loading
            // setLoadingAnimationVisible(true);

            // Thêm thời gian chờ trước khi chuyển trang
            setTimeout(() => {
                onLoginSuccess();  // Điều hướng sau 1 giây
            }, 0);
        } catch (error) {
            console.error("Đăng nhập thất bại", error);
            setError('Email hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
        }
    };


    // Toggle visibility of forgot password
    const handleForgotPassword = () => {
        setVisibleForgotPassword(!visibleForgotPassword);
    };

    // Toggle visibility of register
    const handleRegister = () => {
        setVisibleRegister(!visibleRegister);
    };

    const LoginForm = () => (
        <>

            <Box component="form" onSubmit={handleLogin} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: 2, width: '280px' }}>
                {/* <Snowfall /> */}
                <Typography variant="h6" gutterBottom color="primary">Đăng Nhập</Typography>
                <TextField label="Mã số sinh viên" focused type="" fullWidth margin="normal" name="email" InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập email của bạn" required />
                <TextField label="Mật khẩu" type={showPassword ? 'text' : 'password'} variant="outlined" fullWidth margin="normal" name="password"
                    InputProps={{
                        startAdornment: <LockIcon sx={{ marginRight: 1 }} />,
                        endAdornment: (
                            <Button onClick={() => setShowPassword(!showPassword)} sx={{ padding: 0 }}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </Button>
                        ),
                    }}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                />
                {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label="Nhớ mật khẩu" />
                <Link onClick={handleForgotPassword} variant="body2" sx={{ display: 'flex', marginTop: 1, justifyContent: "flex-end" }}>Quên mật khẩu?</Link>
                <Divider sx={{ margin: '16px 0' }} />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} className={`${styles.button} ${styles.hoverEffect}`}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Nhập'}
                </Button>
                <Link onClick={handleRegister} variant="body2" sx={{ display: 'block', marginTop: 2, textAlign: 'center' }}>Chưa có tài khoản? Đăng ký</Link>
            </Box>
        </>

        // </StyledComponent>
    );

    useEffect(() => {
        const fadeInLogo = () => {
            let opacity = 0;
            let position = 100;
            const interval = setInterval(() => {
                if (opacity < 1 || position > 0) {
                    opacity += 0.1;
                    position -= 5;
                    setLogoOpacity(opacity);
                    setLogoPosition(position);
                } else {
                    clearInterval(interval);
                }
            }, 20);
        };

        fadeInLogo();
    }, []);


    return (
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'row' }}>
            {/* {loadingAnimationVisible ? (
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: '550px', height: '550px', textAlign: 'center', alignSelf: 'center' }} />
            ) : ( */}
            <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', marginBottom: 0 }}>
                    <Box component="img" src={logo} alt="Logo"
                        sx={{ width: '250px', position: 'absolute', top: `${logoPosition}px`, left: '75%', transform: 'translateX(-50%)', opacity: logoOpacity, transition: 'opacity 0.5s ease-in-out, top 0.5s ease-in-out' }}
                    />
                    <Lottie animationData={buildAnimation} style={{ width: '450px', height: '450px', zIndex: 1 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '-20px' }}>
                    <ParticlesComponent />
                    {visibleForgotPassword ? <ForgotPassword onClose={handleForgotPassword} /> : visibleRegister ? <Register onClose={handleRegister} /> : <LoginForm />}
                </Box>
            </>
            {/* )
            } */}
        </Container>
    );


};

export default Login;
