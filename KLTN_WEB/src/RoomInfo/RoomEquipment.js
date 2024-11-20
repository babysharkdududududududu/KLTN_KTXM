import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { Bed, AcUnit, Lightbulb } from '@mui/icons-material';
import { createMaintenanceRoute } from '../API/APIRouter';
import axios from 'axios';
import Lottie from 'lottie-react';
import fan from './asset/fan.json';
import bed from './asset/bed.json';
import lamp from './asset/lamp.json';

const RoomEquipment = ({ equipment, getRoomById, roomNumber }) => {
    const updateStatus = async (item) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        const maintenanceNumber = `BT${roomNumber}-${item.equipNumber}-${formattedDate}-${formattedTime}`;

        try {
            await axios.post(createMaintenanceRoute, {
                maintenanceNumber,
                item: item.equipNumber,
                status: 2,
                roomNumber,
            });
            await getRoomById();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const statusDetails = {
        0: { text: 'Hoạt động', color: 'green' },
        1: { text: 'Hoạt động', color: '#4caf50' },
        2: { text: 'Kiểm tra', color: '#1976d2' },
        3: { text: 'Xử lý', color: '#ff9800' },
        4: { text: 'Sửa chữa', color: '#9c27b0' },
        5: { text: 'Hoạt động', color: 'green' },
        6: { text: 'Không sửa được', color: '#d32f2f' },
    };

    // Group equipment by name
    const groupedEquipment = {
        'đèn': equipment.filter(item => item.name.toLowerCase().includes('đèn')),
        'quạt': equipment.filter(item => item.name.toLowerCase().includes('quạt')),
        'giường': equipment.filter(item => item.name.toLowerCase().includes('giường')),
    };

    return (
        <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 2 }}>
                    <Bed sx={{ marginRight: 1 }} /> Trang Thiết Bị Trong Phòng
                </Typography>

                <Grid container spacing={2}>
                    {Object.keys(groupedEquipment).map((type, index) => (
                        <Grid item xs={4} key={index}>
                            {/* <Typography variant="h6" sx={{ marginBottom: 1 }}>{type.charAt(0).toUpperCase() + type.slice(1)}</Typography> */}

                            {/* Render Lottie animation for each type */}
                            {type === 'quạt' && <Lottie animationData={fan} loop={true} style={{ width: '150px', height: '100px', margin: '10px auto' }} />}
                            {type === 'đèn' && <Lottie animationData={lamp} loop={true} style={{ width: '100px', height: '100px', margin: '10px auto' }} />}
                            {type === 'giường' && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '100px', margin: '10px auto' }}>
                                    <Lottie animationData={bed} loop={true} style={{ width: '50px', height: '50px' }} />
                                </div>
                            )}


                            <Grid container spacing={1}>
                                {groupedEquipment[type].map((item, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Paper elevation={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
                                            {/* Display icon based on equipment name */}
                                            {/* {item.name.toLowerCase().includes('quạt') && <AcUnit sx={{ marginRight: 1 }} />}
                                            {item.name.toLowerCase().includes('đèn') && <Lightbulb sx={{ marginRight: 1 }} />}
                                            {item.name.toLowerCase().includes('giường') && <Bed sx={{ marginRight: 1 }} />} */}
                                            {item.name.toLowerCase().includes('quạt')}
                                            {item.name.toLowerCase().includes('đèn')}
                                            {item.name.toLowerCase().includes('giường')}

                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', color: statusDetails[item.status]?.color || '#000', marginLeft: 2 }}
                                            >
                                                {statusDetails[item.status]?.text || 'Trạng thái không xác định'}
                                            </Typography>

                                            {(item.status === 1 || item.status === 5) && (
                                                <button onClick={() => updateStatus(item)} style={{ marginLeft: '10px', padding: '5px 10px', border: 'none', borderRadius: '5px', backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}>
                                                    Báo hỏng
                                                </button>
                                            )}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Grid>
    );
};

export default RoomEquipment;

// import React from 'react';
// import { Typography, Grid, Paper } from '@mui/material';
// import { Bed } from '@mui/icons-material';
// import { createMaintenanceRoute } from '../API/APIRouter';
// import axios from 'axios';

// const RoomEquipment = ({ equipment, getRoomById, roomNumber }) => {
//     const updateStatus = async (item) => {
//         console.log(item, "item");

//         const now = new Date();
//         const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
//         const formattedTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
//         const maintenanceNumber = `BT${roomNumber}-${item.equipNumber}-${formattedDate}-${formattedTime}`;
//         console.log(maintenanceNumber, "maintenance number");
//         try {
//             const response = await axios.post(createMaintenanceRoute, {
//                 maintenanceNumber,
//                 item: item.equipNumber,
//                 status: 2,
//                 roomNumber,
//             });
//             await getRoomById();
//         } catch (error) {
//             if (error.response) {
//                 if (error.response.status === 409) {
//                     console.log("Maintenance number already exists.");
//                 } else {
//                     console.log("Errorrrr:", error.response.data);
//                 }
//             } else if (error.request) {
//                 console.log("No response received:", error.request);
//             } else {
//                 console.log("Errorrrr:", error.message);
//             }
//         }
//     };

//     const statusDetails = {
//         0: { text: 'Hoạt động', color: 'green' }, 1: { text: 'Hoạt động', color: '#4caf50' }, 2: { text: 'Kiểm tra', color: '#1976d2' },
//         3: { text: 'Xử lý', color: '#ff9800' }, 4: { text: 'Sửa chữa', color: '#9c27b0' }, 5: { text: 'Hoạt động', color: 'green' }, 6: { text: 'Không sửa được', color: '#d32f2f' },
//     };

//     return (
//         <Grid item xs={12}>
//             <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
//                 <Typography variant="h6" display="flex" alignItems="center" sx={{ color: '#1976d2', marginBottom: 1 }}>
//                     <Bed sx={{ marginRight: 1 }} /> Trang Thiết Bị Trong Phòng
//                 </Typography>
//                 <Grid container spacing={2}>
//                     {equipment.map((item, index) => (
//                         <Grid item xs={6} key={index}>
//                             <Paper elevation={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1 }}>
//                                 <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                                     {item.name}
//                                 </Typography>
//                                 <Typography
//                                     variant="body1"
//                                     sx={{ fontWeight: 'bold', color: statusDetails[item.status]?.color || '#000', marginLeft: 2 }}
//                                 >
//                                     {statusDetails[item.status]?.text || 'Trạng thái không xác định'}
//                                 </Typography>

//                                 {(item.status === 1 || item.status === 5) && (
//                                     <button onClick={() => updateStatus(item)} style={{ marginLeft: '10px', padding: '5px 10px', border: 'none', borderRadius: '5px', backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}> Báo hỏng </button>
//                                 )}
//                             </Paper>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Paper>
//         </Grid>
//     );
// };

// export default RoomEquipment;