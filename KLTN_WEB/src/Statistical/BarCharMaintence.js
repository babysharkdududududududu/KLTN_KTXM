import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchStatisticalEquipment } from './GetMaintenanceStatistical';
import { Box, Typography, Slider, Grid, Card } from '@mui/material';

const BarChartStatis = () => {
    const currentYear = new Date().getFullYear();
    const initialRange = [currentYear - 5, currentYear];

    const [countByYear, setCountByYear] = useState({});
    const [yearRange, setYearRange] = useState(initialRange);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInteracted, setUserInteracted] = useState(false); // Track user interaction

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStatisticalEquipment();
                setCountByYear(data.maintenanceCountsByYear);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        let resetTimeout;
        let changeInterval;

        const randomizeRange = () => {
            if (!userInteracted) { // Only randomize if there's no recent user interaction
                const randomStartYear = Math.max(2000, currentYear - Math.floor(Math.random() * 20));
                const randomEndYear = randomStartYear + 5;
                setYearRange([randomStartYear, randomEndYear]);
            }
        };

        const resetYearRange = () => {
            setYearRange(initialRange);
            setUserInteracted(false); // Reset interaction flag
        };

        if (!userInteracted) {
            // Change range every 3 seconds
            changeInterval = setInterval(randomizeRange, 3000);
        }

        // Reset year range to default after 15 seconds without interaction
        resetTimeout = setTimeout(resetYearRange, 15000);

        // Cleanup intervals and timeout on component unmount or interaction
        return () => {
            clearInterval(changeInterval);
            clearTimeout(resetTimeout);
        };
    }, [currentYear, initialRange, userInteracted]);

    // Handle user interaction with slider
    const handleSliderChange = useCallback((e, newValue) => {
        setYearRange(newValue);
        setUserInteracted(true); // Mark that the user interacted with the slider
    }, []);

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    const filteredData = Object.keys(countByYear)
        .filter(year => year >= yearRange[0] && year <= yearRange[1])
        .reduce((obj, year) => {
            obj[year] = countByYear[year];
            return obj;
        }, {});

    const barChartData = {
        labels: Object.keys(filteredData),
        datasets: [
            {
                label: 'Số thiết bị bảo trì',
                data: Object.values(filteredData),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <Grid container style={{ padding: 20 }}>
            <Grid item xs={12} md={12} style={{ padding: '20px', borderRadius: '12px' }}>
                <Card style={{ padding: '20px', borderRadius: '12px', background: 'transparent', boxShadow: 'none' }}>
                    <Typography variant="h6">Số lượng thiết bị bảo trì qua từng năm</Typography>
                    <Box display="flex" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Typography variant="body2" style={{ marginRight: '10px' }}>
                            {yearRange[0]}
                        </Typography>
                        <Slider
                            min={2000}
                            max={currentYear}
                            value={yearRange}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            style={{ flexGrow: 1 }}
                            sx={{
                                '& .MuiSlider-thumb': {
                                    height: 12,
                                    width: 12,
                                },
                                '& .MuiSlider-track': {
                                    height: 4,
                                },
                                '& .MuiSlider-rail': {
                                    height: 4,
                                },
                            }}
                        />
                        <Typography variant="body2" style={{ marginLeft: '10px' }}>
                            {yearRange[1]}
                        </Typography>
                    </Box>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </Card>
            </Grid>
        </Grid>
    );
};

export default BarChartStatis;
