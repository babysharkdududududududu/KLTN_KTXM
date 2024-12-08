import React, { useEffect, useState } from "react";
import { Typography, Button  } from '@mui/material';
import axios from 'axios';
import { statistics } from '../API/APIRouter';
import DownloadIcon from '@mui/icons-material/Download';
export default function StatusRoom({handleExportData}) {
    const [data, setData] = useState({
        totalRooms: 0,
        totalAvailableSpots: 0,
        totalCapacity: 0,
        totalOccupiedSpots: 0,
    });

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get(statistics); // Gọi API
                setData(response.data.data); // Cập nhật dữ liệu vào state
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: "flex-end" }}>
            <div style={{ width: '60%', height: '65px', display: "flex", flexDirection: "row", backgroundColor: "#e7ecf0", borderRadius: 15, justifyContent: 'space-around', alignItems: 'center', marginRight: 30, marginBottom: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography style={{ color: '#464f43' }}>Tổng số phòng</Typography>
                    <Typography style={{ fontWeight: 'bold', marginLeft: 8 }}>{data.totalRooms}</Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography style={{ color: '#464f43' }}>Tổng số giường</Typography>
                        <Typography style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{data.totalCapacity}</Typography>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography style={{ color: '#464f43' }}>Giường trống</Typography>
                        <Typography style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{data.totalAvailableSpots}</Typography>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography style={{ color: '#464f43' }}>Giường có người</Typography>
                        <Typography style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>{data.totalOccupiedSpots}</Typography>
                    </div>
                </div>
                <Button
                    onClick={handleExportData}
                    variant="contained" color="primary" startIcon={<DownloadIcon />}>
                    Xuất dữ liệu
                </Button>
            </div>
        </div>
    );
}
