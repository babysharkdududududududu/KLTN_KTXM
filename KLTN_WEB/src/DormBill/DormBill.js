import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid } from '@mui/material';
import { getBillRoute } from '../API/APIRouter';

export default function DormBill() {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await fetch(`${getBillRoute}/G201`); // Thay thế bằng URL API đúng
                if (response.ok) { // Kiểm tra nếu request thành công
                    const data = await response.json(); // Chuyển response thành JSON
                    setBills(data.data); // Cập nhật dữ liệu hóa đơn vào state
                    console.log('Bills:', data); // In dữ liệu để kiểm tra
                } else {
                    console.error('Error fetching bills:', response.statusText); // In lỗi nếu có
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, []); // Chỉ chạy một lần khi component mount

    return (
        <div style={{ paddingLeft: 40, justifyContent: 'center', display: 'flex' }}>
            <div style={{
                width: '90%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                overflowY: 'auto' // để có thanh cuộn khi có nhiều hóa đơn
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap', // cho phép các item xuống dòng khi không đủ chỗ
                    justifyContent: 'space-between', // phân bổ đều các hóa đơn
                    gap: '20px', // khoảng cách giữa các hóa đơn
                }}>
                    {bills.map(bill => (
                        <div style={{ width: '48%' }} key={bill.orderCode}> {/* Mỗi hóa đơn chiếm 48% chiều rộng của container */}
                            <BillCard bill={bill} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function BillCard({ bill }) {
    return (
        <Card sx={{ width: 600, marginBottom: 2, height: 330 }}>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {bill.orderCode}
                    </Typography>
                    {bill.status === 'Unpaid' ? (
                        <div style={{ backgroundColor: '#ee7c7c', padding: 5, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 25, marginLeft: 10 }}>
                            <Typography variant="body1" component="div" style={{ margin: 0, padding: 0, fontWeight: 'bold' }}>
                                Chưa thanh toán
                            </Typography>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: '#d5f4e4', padding: 5, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 25, color: '#006e34', marginLeft: 10 }}>
                            <Typography variant="body1" component="div" style={{ margin: 0, padding: 0, fontWeight: 'bold' }}>
                                Đã thanh toán
                            </Typography>
                        </div>
                    )}
                </div>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Thông tin chính</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">Thông tin khác</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Mã phòng:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.roomNumber}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Loại hóa đơn:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.billType === 'ELECTRIC' ? 'Điện' : 'Nước'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Số tiền:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.amount} VNĐ</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Ngày tháng:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.monthAndYear}</Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Số tháng trước:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.previousReading}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Số tháng này:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.currentReading}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Ngày tạo hóa đơn:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{new Date(bill.createdAt).toLocaleDateString()}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Mô tả:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>HĐ {bill.billType === 'ELECTRIC' ? 'điện' : 'nước'} tháng {bill.monthAndYear} phòng {bill.roomNumber} </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>
                {bill.status === 'Unpaid' ? (
                    <Button size="small" href={bill.checkoutUrl} target="_blank" rel="noopener noreferrer">Thanh toán</Button>
                ) : (
                    <Typography style={{ textTransform: 'uppercase', color: '#006e34' }}>
                        Đã thanh toán
                    </Typography>
                )}
            </CardActions>
        </Card>
    );
}
