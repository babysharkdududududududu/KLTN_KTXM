import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid } from '@mui/material';

export default function DormBill() {
    // Dữ liệu hóa đơn tạm thời
    const bills = [
        {
            orderCode: 'G202E112024',
            roomNumber: 'G202',
            billType: 'Điện',
            amount: '300.000 VNĐ',
            monthAndYear: '11/2024',
            previousReading: '100',
            currentReading: '200',
            createDateTime: new Date(),
            description: 'Hóa đơn tháng 11',
            status: 'Unpaid'
        },
        {
            orderCode: 'G202E112024',
            roomNumber: 'G202',
            billType: 'Nước',
            amount: '150.000 VNĐ',
            monthAndYear: '11/2024',
            previousReading: '50',
            currentReading: '100',
            createDateTime: new Date(),
            description: 'Hóa đơn tháng 11',
            status: 'Paid'
        }
    ];

    return (
        <div style={{ paddingLeft: 40, backgroundColor: 'pink', justifyContent: 'center', display: 'flex' }}>
            <div style={{ width: '90%', height: '100vh', backgroundColor: 'white' }}>
                <h1>Dorm Bill</h1>
                {bills.map(bill => (
                    <BillCard key={bill.orderCode} bill={bill} />
                ))}
            </div>
        </div>
    );
}

export function BillCard({ bill }) {
    return (
        <Card sx={{ maxWidth: 600, marginBottom: 2 }}>
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {bill.orderCode}
                    </Typography>
                    {bill.status === 'Unpaid' ? (
                        <div style={{ backgroundColor: '#ee7c7c', padding: 5, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 25, marginLeft: 10 }}>
                            <Typography variant="body1" component="div" style={{ margin: 0, padding: 0,  fontWeight: 'bold'  }}>
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
                                            <Typography color='black' fontWeight={'bold'}>{bill.billType}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Số tiền:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.amount}</Typography>
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
                                            <Typography color='black' fontWeight={'bold'}>{bill.createDateTime.toLocaleDateString()}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography color='#b2b8bf'>Mô tả:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='black' fontWeight={'bold'}>{bill.description}</Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        </TableBody>

                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>
                <Button size="small">Thanh toán</Button>
            </CardActions>
        </Card>
    );
}
