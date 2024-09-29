import { Grid } from '@mui/material';
import EquipmentCard from '../EquipmentCard/EquipmentCard';

const EquipmentList = ({ equipment, onCardClick }) => (
    <Grid container spacing={2} justifyContent="center">
        {equipment.map((equip) => (
            <Grid item xs={12} sm={6} md={4} lg={2.1} key={equip._id}>
                <EquipmentCard equipment={equip} onClick={() => onCardClick(equip)} />
            </Grid>
        ))}
    </Grid>
);

export default EquipmentList;
