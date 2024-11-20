import { useEffect, useState } from "react";
import { getStatisticalEquipmentRoute } from "../API/APIRouter";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

// MUI imports
import { Typography, MenuItem, Select, FormControl, InputLabel, Slider, CircularProgress, Box, Grid } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const MaintenanceCountsByYearMonth = () => {
    const [countByYearMonth, setCountByYearMonth] = useState();
    const [countByYear, setCountByYear] = useState();
    const [countByYearRoom, setCountByYearRoom] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states for each chart
    const [selectedYearLine, setSelectedYearLine] = useState(2024);
    const [selectedMonthLine, setSelectedMonthLine] = useState(null);
    const [selectedYearBar, setSelectedYearBar] = useState(2024);
    const [selectedMonthBar, setSelectedMonthBar] = useState(null);
    const [startYear, setStartYear] = useState(2000);  // Default start year
    const [endYear, setEndYear] = useState(2100);  // Default end year
    const [selectedYearScatter, setSelectedYearScatter] = useState(2024);

    const fetchStatisticalEquipment = async () => {
        try {
            const response = await axios.get(getStatisticalEquipmentRoute);
            const data = response.data.data;

            setCountByYearMonth(data.maintenanceCountsByYearMonth);
            setCountByYear(data.maintenanceCountsByYear);
            setCountByYearRoom(data.maintenanceCountsByYearRoom);
        } catch (err) {
            console.error("Error fetching statistical equipment data:", err);
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatisticalEquipment();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    // Line Chart
    const filteredLineData = {
        maintenanceCountsByYearMonth: countByYearMonth && Object.keys(countByYearMonth)
            .filter(month => !selectedMonthLine || month.startsWith(`${selectedYearLine}-${selectedMonthLine}`))
            .reduce((obj, month) => {
                obj[month] = countByYearMonth[month];
                return obj;
            }, {})
    };

    // Scatter Chart
    const filteredScatterData = {
        maintenanceCountsByYearRoom: countByYearRoom && selectedYearScatter && countByYearRoom[selectedYearScatter]
    };

    // Bar Chart
    const filteredData = {
        maintenanceCountsByYear: countByYear && Object.keys(countByYear)
            .filter(year => year >= startYear && year <= endYear)
            .reduce((obj, year) => {
                obj[year] = countByYear[year];
                return obj;
            }, {})
    };

    // Line Chart data
    const lineChartData = {
        labels: Object.keys(filteredLineData.maintenanceCountsByYearMonth || {}),
        datasets: [
            {
                label: 'Maintenance Counts by Year-Month',
                data: Object.values(filteredLineData.maintenanceCountsByYearMonth || {}),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            }
        ]
    };

    const barChartData = {
        labels: Object.keys(filteredData.maintenanceCountsByYear || {}),
        datasets: [
            {
                label: 'Maintenance Counts by Year',
                data: Object.values(filteredData.maintenanceCountsByYear || {}),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    // Scatter Chart data
    const scatterChartData = {
        datasets: [
            {
                label: `Maintenance Counts by Room (${selectedYearScatter})`,
                data: Object.entries(filteredScatterData.maintenanceCountsByYearRoom || {}).map(([room, count]) => ({
                    x: room, // Room name on the x-axis
                    y: count, // Maintenance count on the y-axis
                })),
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                pointRadius: 6,
            }
        ]
    };

    const scatterChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Maintenance Counts by Room (${selectedYearScatter})` },
        },
        scales: {
            x: { type: 'category', title: { display: true, text: 'Room' } },
            y: { type: 'linear', title: { display: true, text: 'Maintenance Count' }, min: 0 }
        }
    };

    // Available years and months
    const availableYears = Object.keys(countByYear || {}).map(year => parseInt(year));
    const availableMonths = Object.keys(countByYearMonth || {}).map(month => month.split('-')[1]).filter((value, index, self) => self.indexOf(value) === index);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>Maintenance Counts by Year</Typography>

            <Grid container spacing={3}>
                {/* Left Column - Year Range Filter and Bar Chart */}
                <Grid item xs={12} md={6}>
                    <Box mb={3}>
                        <Typography variant="h6">Filter by Year Range</Typography>
                        <Typography>Start Year: {startYear}</Typography>
                        <Slider
                            min={2020}
                            max={2024}
                            value={startYear}
                            onChange={(e, newValue) => setStartYear(newValue)}
                            valueLabelDisplay="auto"
                            style={{ marginBottom: '10px' }}
                        />
                        <Typography>End Year: {endYear}</Typography>
                        <Slider
                            min={2000}
                            max={2100}
                            value={endYear}
                            onChange={(e, newValue) => setEndYear(newValue)}
                            valueLabelDisplay="auto"
                            style={{ marginBottom: '20px' }}
                        />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Maintenance Counts by Year</Typography>
                        <Bar data={barChartData} options={{ responsive: true }} />
                    </Box>
                </Grid>

                {/* Right Column - Line Chart and Scatter Chart */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>Maintenance Counts by Year and Month</Typography>

                    <Box mb={3}>
                        <Typography variant="h6">Line Chart Filters</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select value={selectedYearLine} onChange={(e) => setSelectedYearLine(parseInt(e.target.value))}>
                                {availableYears.map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth style={{ marginTop: '10px' }}>
                            <InputLabel>Month</InputLabel>
                            <Select value={selectedMonthLine || ''} onChange={(e) => setSelectedMonthLine(e.target.value)}>
                                <MenuItem value="">All Months</MenuItem>
                                {availableMonths.map((month) => (
                                    <MenuItem key={month} value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Maintenance Counts by Year-Month</Typography>
                        <Line data={lineChartData} options={{ responsive: true }} />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Scatter Chart Filters</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select value={selectedYearScatter} onChange={(e) => setSelectedYearScatter(parseInt(e.target.value))}>
                                {availableYears.map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box mb={3}>
                        <Typography variant="h6">Maintenance Counts by Room ({selectedYearScatter})</Typography>
                        <Scatter data={scatterChartData} options={scatterChartOptions} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MaintenanceCountsByYearMonth;
