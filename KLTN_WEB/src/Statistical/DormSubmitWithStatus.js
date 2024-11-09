// DormStatusPieChart.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f0ad4e', '#5bc0de', '#d9534f', '#28a745', '#0275d8', '#ff69b4'];

const DormStatusPieChart = ({ data }) => {
    const [resetData, setResetData] = useState(data);

    useEffect(() => {
        const totalValue = resetData.reduce((sum, entry) => sum + entry.value, 0);
        const delay = totalValue === 10 ? 10000 : 3000; // 10s nếu tổng là 10, 3s nếu không

        const timer = setTimeout(() => {
            // Reset lại dữ liệu với dữ liệu chính xác
            setResetData(data);
        }, delay);

        return () => clearTimeout(timer); // Dọn dẹp timeout khi component unmount
    }, [resetData, data]); // Thêm "data" vào dependencies để theo dõi thay đổi

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={resetData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={150}
                    label
                    labelLine={false}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                >
                    {resetData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DormStatusPieChart;
