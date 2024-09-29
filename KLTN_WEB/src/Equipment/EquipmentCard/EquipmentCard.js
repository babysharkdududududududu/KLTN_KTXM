import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const EquipmentCard = ({ equipment, onClick }) => (
    <Card
        variant="outlined"
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '180px', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', borderRadius: '12px', cursor: 'pointer' }}
        onClick={onClick}
    >
        <CardHeader
            title={equipment.name}
            sx={{ backgroundColor: '#e3f2fd', borderBottom: '1px solid #bbdefb', textAlign: 'center', padding: '12px', fontSize: '16px', fontWeight: 'bold', color: '#333' }}
        />
        <CardContent sx={{ textAlign: 'left', padding: '12px' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: '8px' }}>
                <strong>Mã số:</strong> {equipment.equipNumber}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '14px' }}>
                <strong>Phòng:</strong> {equipment.roomNumber}
            </Typography>
        </CardContent>
    </Card>
);

export default EquipmentCard;
