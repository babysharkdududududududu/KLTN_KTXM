import axios from "axios";
import { deleteContractRoute, getContractRoute, getUserAndRoomContractRoute } from "../API/APIRouter";
import { useUser } from "../Context/Context";
import { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import ApartmentIcon from '@mui/icons-material/Apartment';

const Contract = () => {
    const { userId } = useUser();
    const [contract, setContract] = useState(null);
    const [user, setUser] = useState(null);
    const [contractId, setContractId] = useState(null);

    const handleGetContract = async () => {
        try {
            const rs = await axios.get(`${getContractRoute}/${userId}`);
            setContract(rs.data.data.contract);
            setUser(rs.data.data.user);
            setContractId(rs.data.data.contract._id);
        } catch (error) {
            setContract(null);
            console.log(error);
        }
    };

    const handleDeleteContract = async () => {
        try {
            await axios.delete(`${deleteContractRoute}${contractId}`, {
                data: { userId: userId }
            });
            handleGetContract();
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetUserAndRoomContract = async () => {
        const roomNumber = contract.roomNumber;
        try {
            const rs = await axios.get(`${getUserAndRoomContractRoute}${userId}/room${roomNumber ? `?roomNumber=${roomNumber}` : ''}`);
            console.log(rs.data.data);
            console.log(getUserAndRoomContractRoute);
            setContract(rs.data.data.contract);
            setUser(rs.data.data.user);
            setContractId(rs.data.data.contract._id);
        } catch (error) {
            setContract(null);
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetContract();
    }, []);

    return (
        <div style={{ padding: '20px', position: 'relative' }}>
            {contract && user ? (
                <Card variant="outlined" style={{ marginTop: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                            <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#333', margin: '0 10px' }}>
                                Hợp đồng
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ display: 'flex', alignItems: 'center' }}>
                                    <ApartmentIcon style={{ marginRight: '10px', color: '#1976d2' }} />
                                    <strong>Bên A:</strong> Ban quản lý KTX Trường Đại Học A
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography style={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon style={{ marginRight: '10px', color: '#1976d2' }} />
                                    <strong>Tên sinh viên:</strong> {user.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Số hợp đồng:</strong> {contract.contractNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>ID người dùng:</strong> {contract.userId}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Số phòng:</strong> {contract.roomNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Ngày bắt đầu:</strong> {new Date(contract.startDate).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Ngày kết thúc:</strong> {new Date(contract.endDate).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Ngày tạo:</strong> {new Date(contract.createdAt).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>

                        <Divider style={{ margin: '20px 0' }} />

                        {/* Thông tin phí */}
                        <Box mt={3}>
                            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', color: '#388e3c' }}>
                                <MoneyIcon style={{ marginRight: '10px' }} />
                                Thông tin phí
                            </Typography>
                            <Typography>- <strong>Phí hàng tháng:</strong> 560.000 VNĐ/tháng</Typography>
                            <Typography>- <strong>Chu kỳ thanh toán:</strong> 10 tháng/lần</Typography>
                            <Typography>- <strong>Điện:</strong> Miễn phí 48 kWh/tháng, tính phí 2.500 VNĐ/kWh sau đó.</Typography>
                            <Typography>- <strong>Nước:</strong> Miễn phí 3 m³/tháng, tính phí 5.000 VNĐ/m³ sau đó.</Typography>
                        </Box>

                        <Divider style={{ margin: '20px 0' }} />

                        <Box mt={3}>
                            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', color: '#d32f2f' }}>
                                <GavelIcon style={{ marginRight: '10px' }} />
                                Điều khoản hợp đồng
                            </Typography>
                            <Typography>1. Hợp đồng này có hiệu lực kể từ ngày ký.</Typography>
                            <Typography>2. Bên B có trách nhiệm thanh toán đúng hạn theo quy định.</Typography>
                            <Typography>3. Mọi tranh chấp phát sinh sẽ được giải quyết theo quy định của pháp luật.</Typography>
                            <Typography>4. Hợp đồng có thể được sửa đổi, bổ sung nếu có sự đồng ý của cả hai bên.</Typography>
                            <Typography>5. Bên B cam kết tuân thủ các quy định của KTX và không gây ảnh hưởng đến các sinh viên khác.</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) :
                <Typography variant="body2" color="text.secondary" align="center" mt={3}>Không có hợp đồng nào.</Typography>
            }
            <Box style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                <Button variant="contained" color="secondary" style={{ padding: '10px 20px' }} onClick={handleDeleteContract}> Xóa hợp đồng</Button>
                <Button onClick={handleGetUserAndRoomContract} variant="contained" color="primary" style={{ padding: '10px 20px' }}> Gia hạn hợp đồng</Button>
            </Box>
        </div>
    );
};

export default Contract;
