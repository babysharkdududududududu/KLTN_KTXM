import { Box, Container, Grid, Typography } from '@mui/material';
import ImportRoom from '../Import-room/ImportRoom';
import EquipmentUpload from '../Import-equipment/ImportEquipment';
import ImportX from '../Import-xlsx/ImportXlxs';

const Import = () => {
    return (
        <Container sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ marginBottom: 3, textAlign: 'center' }}>
                Nhập Dữ Liệu Hệ Thống Ký Túc Xá
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1, background: '#f9f9f9' }}>
                        <Typography variant="h6" align="center">Nhập dữ liệu phòng</Typography>
                        <ImportRoom />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1, background: '#f9f9f9' }}>
                        <Typography variant="h6" align="center">Nhập dữ liệu thiết bị</Typography>
                        <EquipmentUpload />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1, background: '#f9f9f9' }}>
                        <Typography variant="h6" align="center">Nhập dữ liệu sinh viên </Typography>
                        <ImportX />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Import;
