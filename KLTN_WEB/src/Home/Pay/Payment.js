import { Container, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#f5f5f5', borderRadius: '12px', minHeight: { xs: '200px', md: 220 } }} onClick={() => navigate('/payment')}>
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Thanh toán</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} justifyContent="center">
            </Grid>
        </Container>
    );
}

export default Payment;