import BackIcon from '@mui/icons-material/ArrowBack';
import { Box, Container, Grid, Snackbar, Button, TextField, Avatar, Typography } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUserByIdRoute, updateUserRoute } from "../API/APIRouter";
import { useUser } from "../Context/Context";
import avt from "./asset/avt.jpg";
import style from "./Profile.module.css";
import { Label } from 'react-konva';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = () => {
    const navigate = useNavigate();
    const { userId, userRole } = useUser();
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const now = new Date();

    const getUser = async () => {
        try {
            const response = await axios.get(`${getUserByIdRoute}${userId}`);
            setUser(response.data.data);
            setFormData(response.data.data);
        } catch (err) {
            console.log("Error fetching user data:", err);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

    const handleBack = () => {
        window.history.back();
    };

    const handleUpdateClick = async () => {
        try {
            if (isEditing) {
                await axios.patch(updateUserRoute, {
                    _id: user._id,
                    phone: formData.phone,
                    address: formData.address,
                    email: formData.email,
                    dateOfBirth: formData.dateOfBirth
                });
                setSnackbarMessage("Thông tin đã được cập nhật!");
                setSnackbarOpen(true);
            }
            setIsEditing(!isEditing);
        } catch (err) {
            setSnackbarMessage("Error updating user data: " + (err.response ? err.response.data : err.message));
            setSnackbarOpen(true);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md" className={style.profileContainer}>
            <Grid container spacing={3}>
                <Grid item xs={12} className={style.avatarContainer}>
                    <div className={style.header}>
                        <Avatar className={style.avatar} alt="User Avatar" src={user.image || avt} sx={{ width: 100, height: 100 }} />
                        <Typography variant="h5" className={style.userName}>{user.name || "User Name"}</Typography>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {
                                userRole === "MANAGER" ? (<Label sx={{ fontWeight: 'bold' }}>Mã nhân viên</Label>) : (<Label sx={{ fontWeight: 'bold' }}>Mã sinh viên</Label>)
                            }
                            <TextField fullWidth variant="outlined" name="codeId" value={formData.userId} disabled />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label sx={{ fontWeight: 'bold' }}>Họ và tên</Label>
                            <TextField fullWidth variant="outlined" name="phone" value={formData.phone} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12}>
                            <Label sx={{ fontWeight: 'bold' }}>Địa chỉ</Label>
                            <TextField fullWidth variant="outlined" name="address" value={formData.address} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label sx={{ fontWeight: 'bold' }}>Giới tính</Label>
                            <TextField fullWidth variant="outlined" name="gender" value={formData.gender} disabled />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Label sx={{ fontWeight: 'bold' }}>Ngày sinh</Label>
                            <TextField fullWidth variant="outlined" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : now.toLocaleDateString()} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12}>
                            <Label sx={{ fontWeight: 'bold' }}>Email</Label>
                            <TextField fullWidth variant="outlined" name="email" value={formData.email} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        {
                            userRole === "STUDENT" ? (
                                <><Grid item xs={12} sm={6}>
                                    <Label sx={{ fontWeight: 'bold' }}>Lớp</Label>
                                    <TextField fullWidth variant="outlined" name="class" value={formData.class} disabled />
                                </Grid><Grid item xs={12} sm={6}>
                                        <Label sx={{ fontWeight: 'bold' }}>Khoa</Label>
                                        <TextField fullWidth variant="outlined" name="faculty" value={formData.faculty} disabled />
                                    </Grid></>
                            ) : null
                        }

                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                    {isEditing ? 'Lưu' : 'Cập nhật'}
                </Button>
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile;
