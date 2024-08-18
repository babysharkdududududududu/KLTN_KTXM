import { Box, Button, TextField, Typography } from "@mui/material";
import ParticlesComponent from "../../Particles/Particle";
import styles from '../Register/Register.module.css';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRoute } from '../../API/APIRouter';
import axios from 'axios';

const Register = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = email && username && password;
        setIsFormValid(isValid);
    }, [email, username, password]);

    const handleRegister = async (event) => {
        event.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Email không hợp lệ.');
            return;
        }
        try {
            const response = await axios.post(registerRoute, {
                name: username,
                password: password,
                email: email
            });
            console.log("Đăng ký thành công", response.data);
            setError('');
        } catch (error) {
            console.error("Đăng ký thất bại", error);
            setError('Đăng ký thất bại. Vui lòng thử lại.');
            navigate('/auth', { state: { email: email } });
        }
    };

    return (
        <Box className={styles.box}>
            <ParticlesComponent />
            <Box component="form" className={styles.form} onSubmit={handleRegister}>
                <Typography variant="h4" gutterBottom color="primary">Đăng ký</Typography>

                <TextField
                    label="Email"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }}
                    placeholder="Nhập email của bạn"
                    required
                />

                <TextField
                    label="Tên Đăng Nhập"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{ startAdornment: <PersonIcon sx={{ marginRight: 1 }} /> }}
                    placeholder="Nhập tên đăng nhập"
                    required
                />

                <TextField
                    label="Mật Khẩu"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ startAdornment: <LockIcon sx={{ marginRight: 1 }} /> }}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={`${styles.button} ${styles.hoverEffect}`}
                    disabled={!isFormValid}
                    sx={{ marginBottom: 2 }}>
                    Đăng Ký
                </Button>

                <Button
                    variant="text"
                    color="secondary"
                    onClick={onClose}
                    fullWidth>
                    Đóng
                </Button>

                {error && <Typography color="error">{error}</Typography>}
            </Box>
        </Box>
    );
};

export default Register;
