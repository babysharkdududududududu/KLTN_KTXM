import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import { getDormSubmissionStatistical } from "../../API/APIRouter";
import axios from "axios";
import { useUser } from '../../Context/Context';
import { Background } from "react-flow-renderer";


const DemoPaper = styled(Paper)(({ theme }) => ({
    minHeight: 185,
    maxHeight: 200,
    alignItems: "center",
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

export default function TotalStudent() {
    const [status, setStatus] = useState({});
    const [total, setTotal] = useState(0);
    const [supTotal, setSupTotal] = useState(0);
    const { userId, roleId } = useUser();

    const handleDormSubmissionStatistical = async () => {
        try {
            const response = await axios.get(getDormSubmissionStatistical);
            const responseData = response.data;

            if (responseData.statusCode === 200) {
                const resultData = responseData.data;
                const filteredStatus = {
                    PENDING: resultData.totalByStatus.PENDING || 0,
                    PAID: resultData.totalByStatus.PAID || 0,
                    ROOM_REQUESTED: resultData.totalByStatus.ROOM_REQUESTED || 0,
                };
                const calculatedTotal = Object.values(filteredStatus).reduce((acc, value) => acc + value, 0);
                setTotal(calculatedTotal);
                setSupTotal(resultData.total || 0); // Ensure supTotal is set properly
                setStatus(filteredStatus);
            } else {
                console.warn("Unexpected response format:", responseData);
            }
        } catch (err) {
            console.error("Error fetching dorm submission statistical:", err);
        }
    };

    useEffect(() => {
        handleDormSubmissionStatistical();
    }, []);

    const widths = Object.values(status).map(value => `${(value / total) * 100}%`);

    return (
        <div >
            {
                roleId === 'MANAGER' ? (
                    <DemoPaper style={{ boxShadow: 'none', borderRadius: '15px' }} square={false}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: '30px' }}>
                            <GroupOutlinedIcon style={{ fontSize: 25, color: '#53556a' }} />
                            <p style={{ fontSize: 15, marginLeft: '10px', color: '#53556a' }}>Đơn đăng ký</p>
                        </div>
                        <div style={{ borderBottom: '1px solid #ebebeb', width: '95%' }}></div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: '100%' }}>
                            <p style={{ fontSize: 15, color: '#53556a', margin: 0, fontWeight: "bold", padding: 10 }}>Tổng đơn đăng ký: {supTotal}</p>
                        </div>
                        <ChartStudent widths={widths} status={status} total={total} />
                        {/* <TotalChart supTotal={supTotal} /> */}
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: '100%', marginTop: '10px' }}>
                            {Object.entries(status).map(([key, value], index) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                    <div style={{ width: '15px', height: '15px', backgroundColor: getColorByIndex(index), borderRadius: '5px' }} />
                                    <p style={{ fontSize: 10, color: '#53556a', margin: 0, marginLeft: '5px' }}>
                                        {`${key === 'PENDING' ? 'Chờ duyệt' : key === 'PAID' ? 'Đã thanh toán' : key === 'ROOM_REQUESTED' ? 'Chèn phòng' : ''}: ${value}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DemoPaper>
                ) : (
                    <DemoPaper sx={{ background: '#fff' }} square={false}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: '30px' }}>

                        </div>

                    </DemoPaper>
                )
            }

        </div>
    );
}

const getColorByIndex = (index) => {
    const colors = ['#4d84f0', '#41cb91', '#ebb426'];
    return colors[index % colors.length];
};

const ChartStudent = ({ widths, status, total }) => {
    const widthValues = Object.values(status).map(value => (total > 0 ? (value / total) * 100 : 0));

    return (
        <div style={{ width: '100%', marginTop: '10px' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                {Object.keys(status).map((key, index) => (
                    <div
                        key={key}
                        style={{
                            width: `${widthValues[index]}%`,
                            height: '30px',
                            backgroundColor: getColorByIndex(index),
                            borderRadius: '5px',
                            display: 'inline-block',
                            transition: 'width 1s ease-in-out',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
const TotalChart = ({ supTotal }) => {
    return (
        <div style={{ width: '100%', marginTop: '10px' }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: '#4d84f0',
                        borderRadius: '5px',
                        transition: 'width 1s ease-in-out',
                    }}
                />
                <div style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    Tổng số sinh viên: {supTotal}
                </div>
            </div>
        </div>
    );
};
