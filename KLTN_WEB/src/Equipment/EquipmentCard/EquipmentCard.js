// import { Typography } from '@mui/material';

// const EquipmentCard = ({ equipment, onClick }) => (
//     <div
//         style={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             height: '200px',
//             width: '100%',
//             borderRadius: '16px',
//             backgroundColor: '#fff',
//             boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
//             cursor: 'pointer',
//             transition: 'transform 0.3s, box-shadow 0.3s',
//             padding: '16px',
//             margin: '10px',
//             '&:hover': {
//                 transform: 'scale(1.02)',
//                 boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',
//             },
//         }}
//         onClick={onClick}
//     >
//         <div
//             style={{
//                 backgroundColor: '#e1f5fe',
//                 borderBottom: '1px solid #90caf9',
//                 textAlign: 'center',
//                 padding: '16px',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 color: '#1e88e5',
//             }}
//         >
//             {equipment.name}
//         </div>
//         <div style={{ textAlign: 'left', }}>
//             <Typography variant="body2" style={{ fontSize: '15px', marginBottom: '8px', color: '#424242' }}>
//                 <strong>Mã số:</strong> {equipment.equipNumber}
//             </Typography>
//             <Typography variant="body2" style={{ fontSize: '15px', color: '#424242' }}>
//                 <strong>Phòng:</strong> {equipment.roomNumber}
//             </Typography>
//         </div>
//     </div>
// );

// export default EquipmentCard;