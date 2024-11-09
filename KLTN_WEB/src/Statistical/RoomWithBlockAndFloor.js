import React, { useState, useEffect } from 'react';
import { Grid, Box, FormControl, InputLabel, Select, MenuItem, Typography, Card } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const Dashboard = ({ roomByBlockAndFloor }) => {
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Chỗ trống',
                data: [],
                backgroundColor: 'rgba(76, 175, 80, 0.5)',
                borderColor: '#4caf50',
                borderWidth: 2,
                fill: true,
                tension: 0.4, // Smooth curve for the line
            },
            {
                label: 'Sức chứa',
                data: [],
                backgroundColor: 'rgba(244, 67, 54, 0.5)',
                borderColor: '#f44336',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            }
        ],
    });

    const handleBlockChange = (event) => {
        setSelectedBlock(event.target.value);
        setSelectedFloor('');
    };

    const handleFloorChange = (event) => {
        setSelectedFloor(event.target.value);
    };

    // Update chartData when selectedBlock or selectedFloor changes
    useEffect(() => {
        const data = roomByBlockAndFloor[selectedBlock]?.[selectedFloor] || [];
        const labels = data.map((room) => room.roomNumber);
        const availableSpots = data.map((room) => room.availableSpot);
        const capacities = data.map((room) => room.capacity);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Chỗ trống',
                    data: availableSpots,
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    borderColor: '#4caf50',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Sức chứa',
                    data: capacities,
                    backgroundColor: 'rgba(244, 67, 54, 0.5)',
                    borderColor: '#f44336',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                }
            ],
        });
    }, [selectedBlock, selectedFloor, roomByBlockAndFloor]);

    useEffect(() => {
        const updateChartData = () => {
            const newData = roomByBlockAndFloor[selectedBlock]?.[selectedFloor] || [];
            const availableSpots = newData.map((room) => room.availableSpot);
            const capacities = newData.map((room) => room.capacity);

            // Resetting the chart data
            setChartData(prevData => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: availableSpots,
                    },
                    {
                        ...prevData.datasets[1],
                        data: capacities,
                    }
                ],
            }));
        };

        const resetAndUpdateChartData = () => {
            updateChartData(); // Show the correct data first

            // Pause for 3 seconds to allow users to observe
            setTimeout(() => {
                // Resetting the chart data to random values
                setChartData(prevData => ({
                    ...prevData,
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: prevData.datasets[0].data.map(() => Math.floor(Math.random() * 20)), // Random values for available spots
                        },
                        {
                            ...prevData.datasets[1],
                            data: prevData.datasets[1].data.map(() => Math.floor(Math.random() * 20)), // Random values for capacities
                        }
                    ],
                }));
            }, 12000); // 3 seconds pause
        };

        const interval = setInterval(resetAndUpdateChartData, 15000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [selectedBlock, selectedFloor, roomByBlockAndFloor]);

    return (
        <Grid container style={{ padding: 20 }}>
            {/* Chart Section */}
            <Grid item xs={12} md={12} style={{ padding: '20px', borderRadius: '12px' }} >
                <Card style={{ padding: '20px', borderRadius: '12px' }}>
                    <Typography variant="subtitle1" align="center" gutterBottom>
                        Biểu đồ chỗ trống và sức chứa của phòng
                    </Typography>
                    <Box style={{ position: 'relative', height: 350, paddingTop: 20 }}>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="flex-end"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 10,
                                padding: '8px 16px',
                                borderRadius: '8px',
                                zIndex: 1,
                            }}
                        >
                            <FormControl size="small" style={{ minWidth: 100, marginRight: -10 }}>
                                <InputLabel style={{ fontSize: '0.75rem' }}>Block</InputLabel>
                                <Select value={selectedBlock} onChange={handleBlockChange} style={{ height: 30, width: 70 }}>
                                    {Object.keys(roomByBlockAndFloor).map((block) => (
                                        <MenuItem key={block} value={block}>{block}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" style={{ minWidth: 100, }}>
                                <InputLabel style={{ fontSize: '0.75rem' }}>Tầng</InputLabel>
                                <Select value={selectedFloor} onChange={handleFloorChange} disabled={!selectedBlock} style={{ height: 30, width: 70 }}>
                                    {selectedBlock && Object.keys(roomByBlockAndFloor[selectedBlock]).map((floor) => (
                                        <MenuItem key={floor} value={floor}>{floor}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Line
                            data={chartData} // Use chartData here
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                elements: {
                                    point: {
                                        radius: 4,
                                        hoverRadius: 6, // Increase radius on hover
                                    },
                                },
                                animation: {
                                    duration: 1000, // Animation duration
                                    easing: 'easeOutBounce', // Easing function
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                let label = context.dataset.label || '';
                                                if (label) {
                                                    label += ': ';
                                                }
                                                label += context.raw; // Show the raw data value
                                                return label;
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    x: { title: { display: true, text: 'Số phòng' } },
                                    y: { min: 0, max: 20, title: { display: true, text: 'Sức chứa' } },
                                },
                            }}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
