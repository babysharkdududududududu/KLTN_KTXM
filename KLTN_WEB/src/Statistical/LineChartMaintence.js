import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchStatisticalEquipment } from './GetMaintenanceStatistical';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card } from '@mui/material';

const LineChartStatis = () => {
    const [countByYear, setCountByYear] = useState({});
    const [countByYearMonth, setCountByYearMonth] = useState({});
    const [selectedYearLine, setSelectedYearLine] = useState(2024);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStatisticalEquipment();
                setCountByYearMonth(data.maintenanceCountsByYearr);
                setCountByYear(data.maintenanceCountsByYear);
                console.log(data.maintenanceCountsByYearr);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Thay đổi năm tự động sau mỗi 3 giây, nhưng dừng nếu có thao tác người dùng
    useEffect(() => {
        const availableYears = Object.keys(countByYearMonth);

        const interval = setInterval(() => {
            if (!userInteracted) {
                setSelectedYearLine((prevYear) => {
                    const currentIndex = availableYears.indexOf(String(prevYear));
                    const nextIndex = (currentIndex + 1) % availableYears.length; // Đảm bảo quay lại năm đầu tiên sau khi đến năm cuối
                    return parseInt(availableYears[nextIndex]);
                });
            }
        }, 3000); // Thay đổi sau 3 giây

        // Reset year automatically after 15 seconds of no interaction
        const resetTimeout = setTimeout(() => {
            setUserInteracted(false);
        }, 15000); // Reset after 15 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(resetTimeout);
        };
    }, [countByYearMonth, userInteracted]); // Khi dữ liệu `countByYearMonth` thay đổi hoặc khi có sự tương tác của người dùng

    const handleYearChange = (e) => {
        setSelectedYearLine(parseInt(e.target.value));
        setUserInteracted(true); // Khi người dùng thay đổi năm, dừng reset
    };

    if (loading) return <Typography variant="h6">Đang tải...</Typography>;
    if (error) return <Typography variant="h6" color="error">{error}</Typography>;

    // Lọc dữ liệu theo năm đã chọn
    const filteredLineData = Object.keys(countByYearMonth)
        .filter((year) => year === String(selectedYearLine)) // Chỉ lọc theo năm
        .reduce((obj, year) => {
            obj[year] = countByYearMonth[year]; // Lấy tất cả các tháng trong năm đã chọn
            return obj;
        }, {});

    // Dữ liệu cho biểu đồ
    const lineChartData = {
        labels: Object.keys(filteredLineData).flatMap(year =>
            Object.keys(filteredLineData[year]).map(month => `${month}-${year}`)
        ),
        datasets: [
            {
                label: `Số thiết bị bảo trì năm ${selectedYearLine} qua từng tháng`, // Cập nhật label theo năm đã chọn
                data: Object.values(filteredLineData).flatMap(monthData => Object.values(monthData)),
                borderColor: '#006400', // Màu xanh lá đậm
                backgroundColor: 'rgba(0,100,0,0.2)', // Màu xanh lá đậm mờ
            }
        ]
    };

    // Lấy các năm có sẵn từ dữ liệu
    const availableYears = Object.keys(countByYearMonth)
        .filter((value, index, self) => self.indexOf(value) === index); // Lấy tất cả các năm duy nhất

    return (
        <Grid container style={{ padding: 20 }}>
            <Grid item xs={12} md={12} style={{ padding: '20px', borderRadius: '12px', position: 'relative' }} >
                <Card style={{ padding: '20px', borderRadius: '12px', background: 'transparent', boxShadow: 'none' }}>
                    <div></div>
                    <FormControl fullWidth style={{ position: 'absolute', top: '40px', height: '30px', right: '20px', width: '100px', padding: '5px' }}>
                        <Select
                            value={selectedYearLine}
                            onChange={handleYearChange}
                            style={{ color: '#006400', fontSize: '14px', padding: '5px', height: '30px', textAlign: 'center', alignItems: 'center', marginTop: '-30px' }}
                            MenuProps={{ PaperProps: { style: { maxHeight: 100, fontSize: '14px' } } }}
                        >
                            {availableYears.map((year) => (
                                <MenuItem key={year} value={year} style={{ fontSize: '14px' }}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Biểu đồ */}
                    <Line data={lineChartData} options={{ responsive: true }} />
                    <Typography variant="body1" style={{ color: '#000', textAlign: 'center' }}>Số thiết bị bảo trì theo từng tháng của năm</Typography>

                </Card>
            </Grid>
        </Grid>
    );
};

export default LineChartStatis;
