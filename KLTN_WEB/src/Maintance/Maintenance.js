import { Build, BuildCircle, CheckCircle, Error, HourglassEmpty, Work } from '@mui/icons-material';
import BackIcon from '@mui/icons-material/ArrowBack';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import { Box, Button, CardContent, CardHeader, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getMaintenanceRoute, updateMaintenanceStatusRoute } from '../API/APIRouter';
import { useUser } from "../Context/Context";
import Avatar from '@mui/material/Avatar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Maintenance.module.css';

const statusColors = { 1: '#4caf50', 2: '#1976d2', 3: '#ff9800', 4: '#9c27b0', 5: '#4caf50', };

const statusText = { 1: 'Hoạt động', 2: 'Kiểm tra', 3: 'Xử lý', 4: 'Sửa chữa', 5: 'Hoàn thành', };

const Maintenance = () => {
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { userId } = useUser();

    const handleGetMaintenance = async () => {
        try {
            const response = await axios.get(getMaintenanceRoute);
            if (Array.isArray(response.data.data)) {
                const sortedData = response.data.data.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
                setMaintenanceData(sortedData);
                console.log("Maintenance data:", sortedData);
            } else {
                console.error("Dữ liệu trả về không phải là một mảng:", response.data);
            }
        } catch (err) {
            console.log("Error fetching maintenance data:", err);
        }
    };

    const handleUpdateStatus = async (item, newStatus, maintenanceNumber, roomNumber) => {
        try {
            const url = `${updateMaintenanceStatusRoute}/${maintenanceNumber}`;
            await axios.patch(url, { status: newStatus, roomNumber: roomNumber, item: item });
            handleGetMaintenance();
        } catch (err) {
            console.log("Error updating status:", err);
        }
    };

    useEffect(() => {
        handleGetMaintenance();
    }, []);

    const handleBack = () => {
        window.history.back();
    };

    const filteredData = maintenanceData.filter(item => {
        const reportedDate = new Date(item.reportedAt);
        return reportedDate.getFullYear() === selectedDate.getFullYear() && reportedDate.getMonth() === selectedDate.getMonth();
    });

    return (
        <Box sx={{ padding: 4, backgroundColor: '#eaeff1', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                <Avatar sx={{ backgroundColor: '#1976d2' }} onClick={handleBack}>
                    <BackIcon />
                </Avatar>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className={styles.datePicker}
                    popperClassName={styles.datePicker__calendar}
                    wrapperClassName={styles.datePicker__input}
                />
            </Box>

            <Grid container spacing={2}>
                {Array.isArray(filteredData) && filteredData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={2} sx={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                            <CardHeader title={<Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>{item.item} { }</Typography>}
                                subheader={`Trạng thái: ${statusText[item.status]}`}
                                avatar={
                                    <TimelineDot sx={{ backgroundColor: statusColors[item.status] }}>
                                        {item.status === 1 ? <Build /> : item.status === 2 ? <HourglassEmpty /> : item.status === 3 ? <Work /> : item.status === 4 ? <BuildCircle /> : item.status === 5 ? <CheckCircle /> : <Error />}
                                    </TimelineDot>
                                }
                                sx={{ backgroundColor: statusColors[item.status], borderRadius: '8px 8px 0 0' }}
                                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                                subheaderTypographyProps={{ color: '#fff', fontSize: '14px' }}
                            />
                            <CardContent sx={{ padding: 2 }}>
                                <div style={{ flexDirection: "row", justifyContent: "space-between", display: 'flex' }}>
                                    <Typography variant="body2" sx={{ marginBottom: 1, fontWeight: 500 }}>
                                        <strong>Phòng:</strong> {item.roomNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
                                        <strong>Ngày tiếp nhận:</strong> <span style={{ color: "red" }}> {new Date(item.reportedAt).toLocaleDateString()}</span>
                                    </Typography>
                                </div>

                                <Typography variant="body2" sx={{ marginBottom: 1, fontWeight: 500 }}>
                                    <strong>Quá trình bảo trì:</strong>
                                </Typography>
                                <Timeline sx={{ padding: 0 }}>
                                    {Array.isArray(item.statusHistory) && item.statusHistory.map((step, idx) => (
                                        <TimelineItem key={idx}>
                                            <TimelineOppositeContent sx={{ flex: 0.3 }}>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(step.updatedAt).toLocaleDateString()}
                                                </Typography>
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot sx={{ backgroundColor: statusColors[step.status] }}>
                                                    {idx === item.statusHistory.length - 1 ? <CheckCircle /> : <Build />}
                                                </TimelineDot>
                                                {idx < item.statusHistory.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2">{statusText[step.status]}</Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>

                                <div style={{ flexDirection: "row", justifyContent: "end", display: 'flex' }}>
                                    {item.status === 5 && (
                                        <Typography variant="body2" sx={{ marginTop: 1, fontWeight: 500 }}>
                                            <strong> Ngày hoàn thành:</strong>
                                            <span style={{ color: '#4caf50' }}> {new Date(item.updatedAt).toLocaleDateString()}</span>
                                        </Typography>
                                    )}
                                </div>

                                <Button variant="outlined" color="primary" sx={{ marginTop: 2 }} onClick={() => handleUpdateStatus(item.item, item.status + 1, item.maintenanceNumber, item.roomNumber)} disabled={item.status >= 5} fullWidth>
                                    Cập nhật trạng thái
                                </Button>
                            </CardContent>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box >
    );
};

export default Maintenance;
