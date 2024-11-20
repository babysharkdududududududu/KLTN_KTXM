import React from 'react';
import { Container, Typography, Grid, Divider } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#f5f5f5', borderRadius: '12px', minHeight: { xs: '200px', md: 220 } }} onClick={() => navigate('/create-user')}>
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Quản lý người dùng</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} justifyContent="center">
            </Grid>
        </Container>
    );
}

export default CreateUser;