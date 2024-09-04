import React from "react";
import styles from './TotalStudent.module.css';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 350,
    height: 150,
    alignItems: "center",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

export default function TotalStudent() {
    const widths = ['70%', '20%', '10%'];
    return (
        <div>
            <DemoPaper square={false} >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: '30px' }}>
                    <GroupOutlinedIcon style={{ fontSize: 25, color: '#53556a' }} />
                    <p style={{ fontSize: 15, marginLeft: '10px', color: '#53556a' }}>Tất cả sinh viên</p>
                </div>
                <div style={{ borderBottom: '1px solid #ebebeb', width: '95%' }}></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: '100%' }}>
                    <p style={{ fontSize: 25, color: '#53556a', margin: 0, fontWeight: "bold" }}>4390</p>
                    <p style={{ fontSize: 15, color: 'green', margin: 0 }}>17% so với tháng trước</p>
                </div>
                <ChartStudent widths={widths} />
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '100%', marginTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                        <div style={{ width: '15px', height: '15px', backgroundColor: '#4d84f0', borderRadius: '5px' }} />
                        <p style={{ fontSize: 15, color: '#53556a', margin: 0, marginLeft: '5px' }}>Có 4390 sinh viên</p>
                    </div>
                    <Brightness1OutlinedIcon style={{ fontSize: 10, color: '#53556a', marginRight: '5px', marginLeft: '5px' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                        <div style={{ width: '15px', height: '15px', backgroundColor: '#41cb91', borderRadius: '5px' }} />
                        <p style={{ fontSize: 15, color: '#53556a', margin: 0, marginLeft: '5px' }}>50 trống</p>
                    </div>
                    <Brightness1OutlinedIcon style={{ fontSize: 10, color: '#53556a', marginRight: '5px', marginLeft: '5px' }} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                        <div style={{ width: '15px', height: '15px', backgroundColor: '#ebb426', borderRadius: '5px' }} />
                        <p style={{ fontSize: 15, color: '#53556a', margin: 0, marginLeft: '5px' }}>30 dự bị</p>
                    </div>
                </div>
            </DemoPaper>
        </div>
    );
}

const ChartStudent = ({ widths }) => {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: '100%', marginTop: '10px' }}>
            <div className={styles.expandAnimation} style={{ width: widths[0], height: '30px', backgroundColor: '#4d84f0', borderRadius: '5px', display: 'inline-block' }} />
            <div style={{ width: '5px', height: '25px', backgroundColor: '#d7d7d7', borderRadius: '5px', marginRight: '5px', marginLeft: '5px' }} />
            <div className={styles.expandAnimationDelay1} style={{ width: widths[1], height: '30px', backgroundColor: '#41cb91', borderRadius: '5px', display: 'inline-block' }} />
            <div style={{ width: '5px', height: '25px', backgroundColor: '#d7d7d7', borderRadius: '5px', marginRight: '5px', marginLeft: '5px' }} />
            <div className={styles.expandAnimationDelay2} style={{ width: widths[2], height: '30px', backgroundColor: '#ebb426', borderRadius: '5px', display: 'inline-block' }} />
        </div>
    );
};;

