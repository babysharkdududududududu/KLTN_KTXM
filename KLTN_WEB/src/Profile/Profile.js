import BackIcon from '@mui/icons-material/ArrowBack';
import { Box } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getUserByIdRoute, updateUserRoute } from "../API/APIRouter";
import { useUser } from "../Context/Context";
import avt from "./asset/avt.jpg";
import style from "./Profile.module.css";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const now = new Date();

    const getUser = async () => {
        try {
            const response = await axios.get(getUserByIdRoute + userId);
            setUser(response.data.data);
            setFormData(response.data.data);
        } catch (err) {
            console.log("Error fetching user data:", err);
        }
    };

    React.useEffect(() => {
        getUser();
    }, []);
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
        <div className={style.profileContainer}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2, cursor: 'pointer', display: { xs: 'flex', md: 'none', } }}>
                <Avatar sx={{ backgroundColor: '#1976d2' }} onClick={handleBack}>
                    <BackIcon />
                </Avatar>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} className={style.avatarContainer}>
                    <div className={style.header}>
                        <Avatar className={style.avatar} alt="User Avatar" src={user.image || avt} />
                        <h2 className={style.userName}>{user.name || "User Name"}</h2>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Mã:</label>
                            <TextField fullWidth variant="outlined" name="codeId" value={formData.codeId} disabled />
                        </Grid>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Số điện thoại:</label>
                            <TextField fullWidth variant="outlined" name="phone" value={formData.phone} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>



                        <Grid item xs={12} sm={6} className={style.listItem}>
                            <label>Địa chỉ:</label>
                            <TextField fullWidth variant="outlined" name="address" value={formData.address} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Giới tính:</label>
                            <TextField fullWidth variant="outlined" name="gender" value={formData.gender} disabled />
                        </Grid>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Năm sinh:</label>
                            <TextField fullWidth variant="outlined" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : now.toLocaleDateString()} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12} sm={6} className={style.listItem}>
                            <label >Email:</label>
                            <TextField fullWidth variant="outlined" name="email" value={formData.email} onChange={isEditing ? handleChange : null} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Lớp:</label>
                            <TextField fullWidth variant="outlined" name="class" value={formData.class} disabled />
                        </Grid>
                        <Grid item xs={6} sm={6} className={style.listItem}>
                            <label>Khoa:</label>
                            <TextField fullWidth variant="outlined" name="faculty" value={formData.faculty} disabled />
                        </Grid>
                    </Grid>
                </Grid>


            </Grid>
            <div className={style.profileActions}>
                <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                    {isEditing ? 'Lưu' : 'Cập nhật'}
                </Button>
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                    Đăng xuất
                </Button>
            </div>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;
