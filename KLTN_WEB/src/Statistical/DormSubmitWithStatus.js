import { Grid, Typography, Card, Select, MenuItem, FormControl } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSubmissionNameAndId } from '../API/APIRouter';
import axios from 'axios';

const COLORS = ['#f0ad4e', '#5bc0de', '#d9534f', '#28a745', '#0275d8', '#ff69b4'];
const RESET_COLOR = '#024891';

const DormStatusPieChart = ({ data = [], initialSettingId = 'W2024' }) => {
    const [selectedSettingId, setSelectedSettingId] = useState(initialSettingId);
    const [isResetting, setIsResetting] = useState(false);
    const [id, setId] = useState([]);
    const [name, setName] = useState([]);
    const [displayTitle, setDisplayTitle] = useState('');

    // Tạo giá trị giả cho data khi không có dữ liệu thực
    const defaultData = [
        { name: 'Option 1', value: 4 },
        { name: 'Option 2', value: 6 },
        { name: 'Option 3', value: 3 },
        { name: 'Option 4', value: 2 },
    ];

    const filteredData = Array.isArray(data)
        ? data.find(item => item.settingId === selectedSettingId)?.data || defaultData
        : defaultData;

    const [resetData, setResetData] = useState(filteredData);

    const fetchSubmissionNameAndId = async () => {
        try {
            const { data } = await axios.get(getSubmissionNameAndId);
            const submissionNameAndId = data.data.nameSetting;
            const ids = [];
            const names = [];

            Object.entries(submissionNameAndId).forEach(([id, name]) => {
                ids.push(id);
                names.push(name);
            });

            setId(ids);
            setName(names);
        } catch (err) {
            console.error("Error fetching submission name and id:", err);
        }
    };

    useEffect(() => {
        fetchSubmissionNameAndId();
    }, []);

    useEffect(() => {
        setResetData(filteredData);
        setIsResetting(false);
    }, [filteredData, selectedSettingId]);

    useEffect(() => {
        if (selectedSettingId) {
            const index = id.indexOf(selectedSettingId);
            setDisplayTitle(index !== -1 ? name[index] : selectedSettingId);
        }
    }, [selectedSettingId, id, name]);

    useEffect(() => {
        if (!isResetting) {
            const totalValue = resetData.reduce((sum, entry) => sum + entry.value, 0);
            const delay = totalValue === 10 ? 10000 : 3000;
            const timer = setTimeout(() => {
                setIsResetting(true);
                setResetData([{ name: 'Tổng số', value: totalValue }]);
            }, delay);

            return () => clearTimeout(timer);
        } else {
            const resetTimer = setTimeout(() => {
                setResetData(filteredData);
                setIsResetting(false);
            }, 3000);

            return () => clearTimeout(resetTimer);
        }
    }, [isResetting, resetData, filteredData]);

    const handleSettingChange = (event) => {
        setSelectedSettingId(event.target.value);
    };
    useEffect(() => {
        if (!id.includes(initialSettingId)) {
            setSelectedSettingId(id[0] || '');
        } else {
            setSelectedSettingId(initialSettingId);
        }
    }, [id, initialSettingId]);

    return (
        <Grid container style={{ padding: 20, marginTop: 20 }}>
            <Grid item xs={12}>
                <Card style={{ background: 'transparent', boxShadow: 'none', marginTop: 20 }}>
                    <div style={{ display: 'flex' }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" gutterBottom style={{ textAlign: 'center' }}>
                                Biểu đồ đơn đăng ký đợt {displayTitle}
                            </Typography>
                        </Grid>
                        <FormControl style={{ minWidth: 120, marginRight: 10 }}>
                            {id.length > 0 && (
                                <Select
                                    value={selectedSettingId}
                                    onChange={handleSettingChange}
                                    style={{
                                        fontSize: '0.875rem',
                                        padding: '6px 0',
                                        height: '30px',
                                    }}
                                >
                                    {data.map((item) => {
                                        const index = id.indexOf(item.settingId);
                                        const displayName = index !== -1 ? `${name[index]}` : item.settingId;
                                        return (
                                            <MenuItem key={item.settingId} value={item.settingId} style={{ fontSize: '0.875rem' }}>
                                                {displayName}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormControl>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={resetData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={120}
                                label
                                labelLine={false}
                                isAnimationActive={true}
                                animationBegin={0}
                                animationDuration={800}  // Tăng giảm thời gian animation để mượt mà hơn
                                animationEasing="ease-out"  // Thêm easing cho hoạt ảnh mượt mà hơn
                            >
                                {resetData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isResetting ? RESET_COLOR : COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DormStatusPieChart;
