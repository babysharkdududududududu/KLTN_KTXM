import { Alert, Box, Button, Container, Divider, TextField, Typography } from "@mui/material";
import styles from './ForgotPassword.module.css';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword = ({ onClose }) => {
    return (
        <Box className={styles.box}>
            <Box component="form" className={styles.form}>
                <Typography variant="h5" gutterBottom color="primary">Quên Mật Khẩu</Typography>
                <TextField label="Email" type="email" fullWidth margin="normal" name="email" InputProps={{ startAdornment: <EmailIcon sx={{ marginRight: 1 }} /> }} placeholder="Nhập email của bạn" required />
                <Button type="submit" variant="contained" color="primary" fullWidth className={`${styles.button} ${styles.hoverEffect}`}> Gửi Email Reset</Button>
                <Divider sx={{ margin: '16px 0' }} />
                <Button variant="text" color="secondary" onClick={onClose} fullWidth> Đóng</Button>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
