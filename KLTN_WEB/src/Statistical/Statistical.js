// Statistical.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import style from './Statistical.module.css';
import axios from 'axios';
import { getRoomRoute, getStatisticalRoomRoute, getStatisticalDormRoute, getSubmissionNameAndId } from '../API/APIRouter';
import Dashboard from './RoomWithBlockAndFloor';
import { Grid } from '@mui/material';
import TabsComponent from './TabsComponent'; // Import the TabsComponent
import DormStatusPieChart from './DormSubmitWithStatus'
import MaintenanceCountsByYearMonth from './MaintenaceWithYear';
import BarChartStatis from './BarCharMaintence';
import LineChartStatis from './LineChartMaintence';
import ScatterChartStatis from './ScatterMaintence';
import NumberEquipment from './NumberEquipment';
const Statistical = () => {
    const [listRooms, setListRooms] = useState([]);
    const [totalRooms, setTotalRooms] = useState(0);
    const [totalRoomsAvailable, setTotalRoomsAvailable] = useState(0);
    const [totalAvailableSlot, setTotalAvailableSlot] = useState(0);
    const [totalCapacity, setTotalCapacity] = useState(0);
    const [activeTab, setActiveTab] = useState('BarChartRooms');
    const [totalDorm, setTotalDorm] = useState(0);
    const [totalDormStatus, setTotalDormStatus] = useState({});
    const [roomByBlockAndFloor, setRoomByBlockAndFloor] = useState({});
    const [pieDataBySetting, setPieDataBySetting] = useState([]);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(getRoomRoute);
            setListRooms(data.data.results);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };


    const fetchStatisticalRoom = async () => {
        try {
            const { data } = await axios.get(getStatisticalRoomRoute);
            setRoomByBlockAndFloor(data.data.roomsByBlockAndFloor);
            setTotalRooms(data.data.totalRoom);
            setTotalRoomsAvailable(data.data.totalRoomAvailable);
            setTotalAvailableSlot(data.data.totalAvailableSpots);
            setTotalCapacity(data.data.totalCapacity);
        } catch (err) {
            console.error("Error fetching statistical room data:", err);
        }
    };

    const fetchStatisticalDorm = async () => {
        try {
            const { data } = await axios.get(getStatisticalDormRoute);
            setTotalDorm(data.data.totalDormSubmission);
            setTotalDormStatus(data.data.totalByStatus);
            if (data.data.submissionBySetting) {
                setPieDataBySetting(preparePieChartData(data.data.submissionBySetting));
            }
        } catch (err) {
            console.error("Error fetching statistical dorm data:", err);
        }
    };

    const preparePieChartData = (submissionBySetting) => {
        const statusMap = {
            PENDING: 'Chờ xử lý',
            ACCEPTED: 'Chấp nhận đơn đăng ký',
            AWAITING_PAYMENT: 'Chờ thanh toán',
            PAID: 'Đã thanh toán',
            ASSIGNED: 'Đã xếp phòng',
            REJECTED: 'Từ chối đơn đăng ký',
            ROOM_REQUESTED: 'Yêu cầu phòng'
        };
        return Object.keys(submissionBySetting).map((settingId) => ({
            settingId,
            data: Object.entries(
                submissionBySetting[settingId].reduce((counts, { status }) => {
                    const mappedStatus = statusMap[status] || status;
                    counts[mappedStatus] = (counts[mappedStatus] || 0) + 1;
                    return counts;
                }, {})
            ).map(([name, value]) => ({ name, value }))
        }));
    };
    useEffect(() => {
        fetchRooms();
        fetchStatisticalRoom();
        fetchStatisticalDorm();
    }, []);

    const roomChartData = [
        { name: "Tổng số phòng", value: totalRooms },
        { name: "Tổng số phòng trống", value: totalRoomsAvailable },
        { name: "Tổng số phòng đang ở", value: totalRooms - totalRoomsAvailable }
    ];

    const bedChartData = [
        { name: "Tổng chỗ giường", value: totalCapacity },
        { name: "Tổng số giường trống", value: totalAvailableSlot },
        { name: "Tổng số giường đang ở", value: totalCapacity - totalAvailableSlot }
    ];

    const prepareChartDataByBlock = (data) => {
        const stats = { G: { 'Hoạt động': 0, 'Bảo trì': 0 }, I: { 'Hoạt động': 0, 'Bảo trì': 0 } };
        data.forEach(room => {
            const block = room.block;
            const status = room.status === 0 ? 'Hoạt động' : 'Bảo trì';
            if (stats[block]) {
                stats[block][status]++;
            }
        });
        return [
            { block: 'G', 'Hoạt động': stats.G['Hoạt động'], 'Bảo trì': stats.G['Bảo trì'] },
            { block: 'I', 'Hoạt động': stats.I['Hoạt động'], 'Bảo trì': stats.I['Bảo trì'] },
        ];
    };

    const blockChartData = prepareChartDataByBlock(listRooms);

    const statusMap = {
        PENDING: 'Chờ xử lý',
        ACCEPTED: 'Chấp nhận đơn đăng ký',
        AWAITING_PAYMENT: 'Chờ thanh toán',
        PAID: 'Đã thanh toán',
        ASSIGNED: 'Đã xếp phòng',
        REJECTED: 'Từ chối đơn đăng ký',
        ROOM_REQUESTED: 'Yêu cầu phòng'
    };

    const dormStatusChartData = [
        { name: "Tổng số", value: totalDorm },
        ...Object.keys(totalDormStatus).map(status => ({
            name: statusMap[status] || status,
            value: totalDormStatus[status],
        }))
    ];

    // Dorm status pie chart data
    const dormStatusPieData = Object.keys(totalDormStatus).map(status => ({
        name: statusMap[status] || status,
        value: totalDormStatus[status],
    }));

    return (
        <div className={style['statistical-container']}>
            {/* <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} /> */}

            {/* <div className={style['chart-container']}>
                <div className={style['chart-row']}>
                    {activeTab === 'BarChartRooms' && (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={roomChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#4db8ff" name="Số phòng" isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                    {activeTab === 'BarChartBeds' && (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={bedChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#2d8f45" name="Số giường" isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                    {activeTab === 'BarChartBlocks' && (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={blockChartData}>
                                <CartesianGrid strokeDasharray="5 5" />
                                <XAxis dataKey="block" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Hoạt động" fill="#28a745" name="Số phòng hoạt động" isAnimationActive={true} />
                                <Bar dataKey="Bảo trì" fill="#dc3545" name="Số phòng bảo trì" isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className={style['chart-row']}>
                    {activeTab === 'BarChartDormStatus' && (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={dormStatusChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#f0ad4e" name="Số lượng trạng thái" isAnimationActive={true} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div> */}
            <Grid item xs={12} md={3}>
                <NumberEquipment />
            </Grid>

            <Grid container spacing={0}>
                <Grid item xs={12} md={6} >
                    <Dashboard roomByBlockAndFloor={roomByBlockAndFloor} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DormStatusPieChart data={pieDataBySetting} initialSettingId="W2024" />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                    <MaintenanceCountsByYearMonth />
                </Grid> */}
                <Grid item xs={12} md={4}>
                    <BarChartStatis />
                </Grid>
                <Grid item xs={12} md={4}>
                    <LineChartStatis />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ScatterChartStatis />
                </Grid>

            </Grid>

        </div>
    );
};

export default Statistical;
