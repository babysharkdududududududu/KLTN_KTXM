import React from "react";
import { Typography } from '@mui/material';

export default function StatusRoom() {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: "flex-end" }}>
            <div style={{ width: '60%', height: '65px', display: "flex", flexDirection: "row", backgroundColor: "#e7ecf0", borderRadius: 15, justifyContent: 'space-around', alignItems: 'center', marginRight: 30, marginBottom: 10 }}>
                <div>
                    <Typography style={{ color: '#464f43' }}>Tổng số phòng</Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}></Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div>
                        <Typography style={{ color: '#464f43' }}>Tổng số giường</Typography>
                        <Typography style={{ fontSize: 18, fontWeight: 'bold' }}></Typography>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div>
                        <Typography style={{ color: '#464f43' }}>Giường trống</Typography>
                        <Typography style={{ fontSize: 18, fontWeight: 'bold' }}></Typography>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ borderLeft: '2px solid #e5e5e5', height: '40px', marginRight: 10 }}></div>
                    <div>
                        <Typography style={{ color: '#464f43' }}>Giường có người</Typography>
                        <Typography style={{ fontSize: 18, fontWeight: 'bold' }}></Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}