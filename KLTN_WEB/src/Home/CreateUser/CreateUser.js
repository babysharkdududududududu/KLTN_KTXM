import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllUserRoute } from '../../API/APIRouter';
import axios from 'axios';

const CreateUser = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState({}); // Khởi tạo users là một đối tượng rỗng
    const [count, setCount] = useState(0);

    useEffect(() => {
        handleGetAllUser();
    }, []);

    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            const fetchedUsers = response.data.data
                .filter(user => user.role !== "USERS")
                .map(user => ({
                    ...user,
                    id: user.userId,
                }));

            // Phân loại và đếm số lượng người dùng theo role (chữ in hoa)
            const usersByRole = fetchedUsers.reduce((acc, user) => {
                const roleUpperCase = user.role.toUpperCase(); // Chuyển role thành chữ in hoa
                if (!acc[roleUpperCase]) {
                    acc[roleUpperCase] = { count: 0 };
                }
                acc[roleUpperCase].count++;
                return acc;
            }, {});

            const count = fetchedUsers.length;
            setCount(count);
            setUsers(usersByRole); // Lưu trữ usersByRole
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Hàm chuyển đổi role thành tên đầy đủ
    const getRoleName = (role) => {
        switch (role) {
            case 'MANAGER':
                return 'Quản lý';
            case 'CASHIER':
                return 'Thu ngân';
            case 'TECHNICAL':
                return 'Kỹ thuật viên';
            default:
                return role;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#fff', borderRadius: '12px', minHeight: { xs: '200px', md: 220 } }} onClick={() => navigate('/create-user')}>
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Quản lý người dùng</Typography>
            <Divider sx={{ marginBottom: 2 }} />

            {/* Render danh sách số lượng người dùng theo role */}
            <Grid container spacing={2}>
                {Object.entries(users).length > 0 ? (
                    Object.entries(users).map(([role, { count }]) => (
                        <Grid item xs={12} key={role}>
                            <Typography variant="h6" sx={{ fontSize: '16px', color: '#424242' }}>
                                {getRoleName(role)}: <strong>{count} người</strong>
                            </Typography>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', fontSize: '16px', color: '#f44336' }}>
                        Không có người dùng nào.
                    </Typography>
                )}
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button variant="contained" color="primary">
                    Đến trang
                </Button>
            </div>
        </Container>
    );
}

export default CreateUser;
