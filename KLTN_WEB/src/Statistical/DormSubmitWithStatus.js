import { Grid, Typography, Card, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSubmissionNameAndId } from '../API/APIRouter';
import axios from 'axios';

const COLORS = ['#f0ad4e', '#5bc0de', '#d9534f', '#28a745', '#0275d8', '#ff69b4'];
const RESET_COLOR = '#024891';

const DormStatusPieChart = ({ data }) => {
    const [selectedSettingId, setSelectedSettingId] = useState(data.length > 0 ? data[0]?.settingId : '');
    const [isResetting, setIsResetting] = useState(false);
    const [submissionNameAndId, setSubmissionNameAndId] = useState({});
    const [id, setId] = useState([]);
    const [name, setName] = useState([]);
    const [displayTitle, setDisplayTitle] = useState('');

    const filteredData = data.find(item => item.settingId === selectedSettingId)?.data || [];
    const [resetData, setResetData] = useState(filteredData);

    const fetchSubmissionNameAndId = async () => {
        try {
            const { data } = await axios.get(getSubmissionNameAndId);
            const submissionNameAndId = data.data.nameSetting;
            const ids = [];
            const names = [];

            // Tách id và name từ đối tượng
            Object.entries(submissionNameAndId).forEach(([id, name]) => {
                ids.push(id);
                names.push(name);
            });

            setId(ids);
            setName(names);

            console.log("ids", ids);
            console.log("names", names);
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
            if (index !== -1) {
                setDisplayTitle(name[index]);
            } else {
                setDisplayTitle(selectedSettingId);
            }
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

    return (
        <Grid container style={{ padding: 20, marginTop: 20 }}>
            <Grid item xs={12}>
                <Card style={{ background: 'transparent', boxShadow: 'none', marginTop: 20 }}>
                    <div style={{ display: 'flex' }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" gutterBottom style={{ textAlign: 'center' }}>
                                Biểu đồ đơn đăng ký đợt: {displayTitle}
                            </Typography>
                        </Grid>
                        <FormControl style={{ minWidth: 120, marginRight: 10 }}>
                            <Select
                                labelId="setting-select-label"
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
                                animationDuration={1000}
                                animationEasing="ease-in-out"
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
