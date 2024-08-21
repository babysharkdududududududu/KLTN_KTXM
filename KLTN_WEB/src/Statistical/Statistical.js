import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import style from './Statistical.module.css';
import axios from 'axios';
import { getRoomRoute } from '../API/APIRouter';

const Statistical = () => {
    const [listRooms, setListRooms] = useState([]);
    const [activeTab, setActiveTab] = useState('LineChart');

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute);
            setListRooms(data.data.results);
            console.log("List rooms:", data.data.results);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    React.useEffect(() => {
        fetchRooms();
    }, []);

    const chartData = listRooms.map(room => ({
        'Số phòng': room.roomNumber,
        'Sức chứa': room.capacity,
        'Chỗ trống': room.availableSpot
    }));

    const prepareChartData = (data) => {
        const stats = { G: { 'Hoạt động': 0, 'Bảo trì': 0 }, I: { 'Hoạt động': 0, 'Bảo trì': 0 } };

        data.forEach(room => {
            const block = room.block;
            const status = room.status === 0 ? 'Hoạt động' : 'Bảo trì';
            stats[block][status]++;
        });

        return [
            { block: 'G', 'Hoạt động': stats.G['Hoạt động'], 'Bảo trì': stats.G['Bảo trì'] },
            { block: 'I', 'Hoạt động': stats.I['Hoạt động'], 'Bảo trì': stats.I['Bảo trì'] },
        ];
    };

    const chatData = prepareChartData(listRooms);

    return (
        <div className={style['statitical-container']}>
            <div className={style['tabs-container']}>
                <button
                    className={activeTab === 'LineChart' ? style.active : ''}
                    onClick={() => setActiveTab('LineChart')}
                >
                    Line Chart
                </button>
                <button
                    className={activeTab === 'BarChartRooms' ? style.active : ''}
                    onClick={() => setActiveTab('BarChartRooms')}
                >
                    Bar Chart (Rooms)
                </button>
                <button
                    className={activeTab === 'BarChartBlocks' ? style.active : ''}
                    onClick={() => setActiveTab('BarChartBlocks')}
                >
                    Tình trạng phòng theo block
                </button>
            </div>

            <div className={style['chart-container']}>
                {activeTab === 'LineChart' && (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                            <XAxis dataKey="Số phòng" tick={{ fill: '#8884d8' }} />
                            <YAxis tick={{ fill: '#8884d8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Sức chứa" stroke="#ff7300" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Chỗ trống" stroke="#387908" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'BarChartRooms' && (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                            <XAxis dataKey="Số phòng" tick={{ fill: '#8884d8' }} />
                            <YAxis tick={{ fill: '#8884d8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                            <Legend />
                            <Bar dataKey="Sức chứa" fill="#ff7300" />
                            <Bar dataKey="Chỗ trống" fill="#387908" />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'BarChartBlocks' && (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chatData}>
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis dataKey="block" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Hoạt động" fill="#82ca9d" />
                            <Bar dataKey="Bảo trì" fill="#ff7300" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default Statistical;
