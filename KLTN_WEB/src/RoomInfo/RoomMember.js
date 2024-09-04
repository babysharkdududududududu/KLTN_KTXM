import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { People } from '@mui/icons-material';

const RoomMembers = ({ userInfo }) => {
    return (
        <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
                    <People sx={{ marginRight: 1 }} /> Danh Sách Thành Viên
                </Typography>
                <Grid container spacing={2}>
                    {userInfo.map((user, index) => (
                        <Grid item xs={6} key={index}>
                            <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                                <Typography variant="body2" sx={{ color: '#1976d2' }}>{user.userId}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Grid>
    );
};

export default RoomMembers;
