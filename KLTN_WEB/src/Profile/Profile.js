import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from 'react-router-dom';
import style from "./Profile.module.css";

import avt from "./asset/avt.jpg";

const Profile = () => {
    const navigate = useNavigate();

    return (
        <div className={style['profile-container']}>
            <div className={style['profile-header']}>
                <Avatar className={style.avt} alt="User Avatar" src={avt} />
                <h2>User Name</h2>
            </div>
            <Divider />

            <List className={style['profile-options']}>
                <ListItem button>
                    <ListItemText primary="Cài đặt tài khoản" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="Thống kê hoạt động" />
                </ListItem>
                <Divider />
                <ListItem button>
                    <ListItemText primary="Quản lý đăng ký" />
                </ListItem>
                <Divider />
            </List>

            <div className={style['profile-actions']}>
                <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                    Đăng xuất
                </Button>
            </div>
        </div>
    );
};

export default Profile;