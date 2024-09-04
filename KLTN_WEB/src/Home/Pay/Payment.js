import React from 'react';
import { Button, Container, Typography, Grid, Divider } from '@mui/material';
import VNPAYImage from './asset/vnpay.png'; // Thay thế bằng đường dẫn tới ảnh VNPAY
import MOMOImage from './asset/momo.png'; // Thay thế bằng đường dẫn tới ảnh MOMO

const Payment = () => {
    const handleVNPAY = () => {
        // Logic thanh toán VNPAY
        console.log("Thanh toán qua VNPAY");
    };

    const handleMOMO = () => {
        // Logic thanh toán MOMO
        console.log("Thanh toán qua MOMO");
    };

    return (
        <Container maxWidth="sm" sx={{ padding: 2, marginTop: 2, background: '#f5f5f5', borderRadius: '12px', maxHeight: 200, minHeight: 215 }}>
            <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#53556a' }}>Thanh toán</Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
                    <img src={VNPAYImage} alt="VNPAY" style={{ width: '80%', marginBottom: 10, cursor: 'pointer' }} />
                </Grid>
                <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
                    <img src={MOMOImage} alt="MOMO" style={{ width: '80%', marginBottom: 10, cursor: 'pointer' }} />

                </Grid>
            </Grid>
        </Container>
    );
}

export default Payment;
