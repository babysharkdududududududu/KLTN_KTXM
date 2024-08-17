import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import style from './Statistical.module.css';

const Statistical = () => {
    const sampleData = [
        { hour: '00:00', Monday: 15, Tuesday: 16, Wednesday: 14, Thursday: 15, Friday: 17, Saturday: 18, Sunday: 19 },
        { hour: '01:00', Monday: 14, Tuesday: 15, Wednesday: 13, Thursday: 14, Friday: 16, Saturday: 17, Sunday: 18 },
        { hour: '02:00', Monday: 13, Tuesday: 14, Wednesday: 12, Thursday: 13, Friday: 15, Saturday: 16, Sunday: 17 },
        { hour: '03:00', Monday: 12, Tuesday: 13, Wednesday: 11, Thursday: 12, Friday: 14, Saturday: 15, Sunday: 16 },
        { hour: '04:00', Monday: 12, Tuesday: 12, Wednesday: 10, Thursday: 11, Friday: 13, Saturday: 14, Sunday: 15 },
        { hour: '05:00', Monday: 13, Tuesday: 13, Wednesday: 11, Thursday: 12, Friday: 14, Saturday: 15, Sunday: 16 },
        { hour: '06:00', Monday: 15, Tuesday: 15, Wednesday: 13, Thursday: 14, Friday: 16, Saturday: 17, Sunday: 18 },
        { hour: '07:00', Monday: 17, Tuesday: 17, Wednesday: 15, Thursday: 16, Friday: 18, Saturday: 19, Sunday: 20 },
        { hour: '08:00', Monday: 19, Tuesday: 19, Wednesday: 17, Thursday: 18, Friday: 20, Saturday: 21, Sunday: 22 },
        { hour: '09:00', Monday: 21, Tuesday: 21, Wednesday: 19, Thursday: 20, Friday: 22, Saturday: 23, Sunday: 24 },
        { hour: '10:00', Monday: 23, Tuesday: 23, Wednesday: 21, Thursday: 22, Friday: 24, Saturday: 25, Sunday: 26 },
        { hour: '11:00', Monday: 25, Tuesday: 25, Wednesday: 23, Thursday: 24, Friday: 26, Saturday: 27, Sunday: 28 },
        { hour: '12:00', Monday: 27, Tuesday: 27, Wednesday: 25, Thursday: 26, Friday: 28, Saturday: 29, Sunday: 30 },
        { hour: '13:00', Monday: 28, Tuesday: 28, Wednesday: 26, Thursday: 27, Friday: 29, Saturday: 30, Sunday: 31 },
        { hour: '14:00', Monday: 29, Tuesday: 29, Wednesday: 27, Thursday: 28, Friday: 30, Saturday: 31, Sunday: 32 },
        { hour: '15:00', Monday: 30, Tuesday: 30, Wednesday: 28, Thursday: 29, Friday: 31, Saturday: 32, Sunday: 33 },
        { hour: '16:00', Monday: 29, Tuesday: 29, Wednesday: 27, Thursday: 28, Friday: 30, Saturday: 31, Sunday: 32 },
        { hour: '17:00', Monday: 27, Tuesday: 27, Wednesday: 25, Thursday: 26, Friday: 28, Saturday: 29, Sunday: 30 },
        { hour: '18:00', Monday: 25, Tuesday: 25, Wednesday: 23, Thursday: 24, Friday: 26, Saturday: 27, Sunday: 28 },
        { hour: '19:00', Monday: 23, Tuesday: 23, Wednesday: 21, Thursday: 22, Friday: 24, Saturday: 25, Sunday: 26 },
        { hour: '20:00', Monday: 21, Tuesday: 21, Wednesday: 19, Thursday: 20, Friday: 22, Saturday: 23, Sunday: 24 },
        { hour: '21:00', Monday: 19, Tuesday: 19, Wednesday: 17, Thursday: 18, Friday: 20, Saturday: 21, Sunday: 22 },
        { hour: '22:00', Monday: 17, Tuesday: 17, Wednesday: 15, Thursday: 16, Friday: 18, Saturday: 19, Sunday: 20 },
        { hour: '23:00', Monday: 16, Tuesday: 16, Wednesday: 14, Thursday: 15, Friday: 17, Saturday: 18, Sunday: 19 },
    ];
    // Tính tổng nhiệt độ cho mỗi ngày
    const totalTemperature = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
    };

    sampleData.forEach(data => {
        totalTemperature.Monday += data.Monday;
        totalTemperature.Tuesday += data.Tuesday;
        totalTemperature.Wednesday += data.Wednesday;
        totalTemperature.Thursday += data.Thursday;
        totalTemperature.Friday += data.Friday;
        totalTemperature.Saturday += data.Saturday;
        totalTemperature.Sunday += data.Sunday;
    });
    const pieData = Object.keys(totalTemperature).map(day => ({
        name: day,
        value: totalTemperature[day],
    }));

    return (
        <div className={style['statitical-container']}>
            <h1>Nhiệt Độ Hằng Ngày (Biểu Đồ Đường)</h1>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                    <XAxis dataKey="hour" tick={{ fill: '#8884d8' }} />
                    <YAxis tick={{ fill: '#8884d8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                    <Legend />
                    <Line type="monotone" dataKey="Monday" stroke="#ff7300" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Tuesday" stroke="#387908" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Wednesday" stroke="#0088FE" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Thursday" stroke="#FFBB28" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Friday" stroke="#FF8042" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Saturday" stroke="#FF00FF" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sunday" stroke="#00FFFF" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>

            <h1>Nhiệt Độ Hằng Ngày (Biểu Đồ Cột)</h1>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                    <XAxis dataKey="hour" tick={{ fill: '#8884d8' }} />
                    <YAxis tick={{ fill: '#8884d8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                    <Legend />
                    <Bar dataKey="Monday" fill="#ff7300" />
                    <Bar dataKey="Tuesday" fill="#387908" />
                    <Bar dataKey="Wednesday" fill="#0088FE" />
                    <Bar dataKey="Thursday" fill="#FFBB28" />
                    <Bar dataKey="Friday" fill="#FF8042" />
                    <Bar dataKey="Saturday" fill="#FF00FF" />
                    <Bar dataKey="Sunday" fill="#00FFFF" />
                </BarChart>
            </ResponsiveContainer>
            <h1>Nhiệt Độ Hằng Ngày (Biểu Đồ Tròn)</h1>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#ff7300', '#387908', '#0088FE', '#FFBB28', '#FF8042', '#FF00FF', '#00FFFF'][index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Statistical;
