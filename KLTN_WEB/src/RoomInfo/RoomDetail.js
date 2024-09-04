import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';

const RoomDetails = () => {
    return (
        <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 0, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#1976d2', marginBottom: 1 }}>Thông Tin Về Phòng Ở</Typography>
                <Box paddingY={1}>
                    <Typography>
                        Mỗi phòng có 8 giường tầng, sức chứa tối đa 16 người và được trang bị đầy đủ các tiện nghi như quạt, đèn và máy giặt.
                    </Typography>
                    <Typography>
                        Miễn phí 48kWh điện mỗi tháng, tính phí 3.000 đồng/kWh sau đó.
                    </Typography>
                    <Typography>
                        Miễn phí 3 m³ nước đầu tiên mỗi tháng, tính phí 5.000 đồng/m³ từ tháng tiếp theo.
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    );
};

export default RoomDetails;
