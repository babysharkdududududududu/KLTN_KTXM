import React, { useEffect, useState, useCallback } from 'react';
import { Scatter } from 'react-chartjs-2';
import { fetchStatisticalEquipment } from './GetMaintenanceStatistical';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card } from '@mui/material';

const ScatterChartStatis = () => {
    const currentYear = new Date().getFullYear();
    const [countByYearRoom, setCountByYearRoom] = useState({});
    const [selectedYearScatter, setSelectedYearScatter] = useState(currentYear);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [years, setYears] = useState([]); // State to hold available years
    const [isUserInteracting, setIsUserInteracting] = useState(false); // State to track user interaction

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStatisticalEquipment();
                setCountByYearRoom(data.maintenanceCountsByYearRoom);
                setYears(Object.keys(data.maintenanceCountsByYearRoom).map(year => parseInt(year))); // Set available years
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isUserInteracting) {
                setSelectedYearScatter(prevYear => {
                    const currentIndex = years.indexOf(prevYear);
                    const nextIndex = (currentIndex + 1) % years.length;
                    return years[nextIndex]; // Update to the next year
                });
            }
        }, 3000); // Change every 3 seconds

        // Clean up the interval on unmount
        return () => clearInterval(intervalId);
    }, [years, isUserInteracting]);

    // Handle user interaction
    const handleYearChange = (e) => {
        const selectedYear = parseInt(e.target.value);
        setSelectedYearScatter(selectedYear);
        setIsUserInteracting(true); // Set interaction state to true

        // Reset interaction state after 15 seconds
        setTimeout(() => {
            setIsUserInteracting(false);
        }, 15000); // 15 seconds
    };

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    const scatterChartData = {
        datasets: [
            {
                label: `Số thiết bị bảo trì của phòng (${selectedYearScatter})`,
                data: Object.entries(countByYearRoom[selectedYearScatter] || {}).map(([room, count]) => ({
                    x: room,
                    y: count,
                })),
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                pointRadius: 6,
            }
        ]
    };

    return (
        <Grid container style={{ padding: 20 }}>
            <Grid item xs={12} md={12} style={{ padding: '20px', borderRadius: '12px' }} >
                <Card style={{ padding: '20px', borderRadius: '12px', background: 'transparent', boxShadow: 'none', position: 'relative' }}>
                    <FormControl style={{ position: 'absolute', top: 30, right: 10, maxWidth: 150, width: 'auto', height: '20px' }}>
                        <Select
                            value={selectedYearScatter}
                            onChange={handleYearChange}
                            style={{ color: '#006400', fontSize: '14px', padding: '5px', textAlign: 'center', alignItems: 'center', height: '30px' }}
                            MenuProps={{ PaperProps: { style: { maxHeight: 100, fontSize: '14px' } } }}
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Scatter data={scatterChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: `Năm (${selectedYearScatter})` },
                        },
                        scales: {
                            x: { type: 'category', title: { display: true, text: 'Phòng' } },
                            y: { type: 'linear', title: { display: true, text: 'Số lượng' }, min: 0 }
                        }
                    }} />
                    <Typography sx={{ textAlign: 'center' }} variant="body1">Danh sách phòng có thiết bị bảo trì theo năm</Typography>

                </Card>
            </Grid>
        </Grid>

    );
};

export default ScatterChartStatis;
