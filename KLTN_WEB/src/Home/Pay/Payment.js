import React from 'react';
import { Container, Typography, Grid, Divider } from '@mui/material';
import VNPAYImage from './asset/vnpay.png'; // Adjust path as needed
import MOMOImage from './asset/momo.png'; // Adjust path as needed

const Payment = () => {
    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#f5f5f5', borderRadius: '12px', minHeight: { xs: '200px', md: 220 } }}>
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Thanh toán</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
                    <img src={VNPAYImage} alt="VNPAY" style={{ width: '80%', marginBottom: 10 }} />
                </Grid>
                <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
                    <img src={MOMOImage} alt="MOMO" style={{ width: '80%', marginBottom: 10 }} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Payment;