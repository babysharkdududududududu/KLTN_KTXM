import { Button, Container, Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#fff', borderRadius: '12px', minHeight: { xs: '200px', md: 220 } }} >
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Thanh toán</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} justifyContent="center">
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/payment')}>
                    Đến trang
                </Button>
            </div>
        </Container>
    );
}

export default Payment;