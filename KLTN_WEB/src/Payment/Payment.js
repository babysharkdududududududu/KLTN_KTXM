import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDormPaymentWithUserId, getUserByIdRoute } from "../API/APIRouter";
import { useUser } from "../Context/Context";
import iuh from './asset/iuh.png';
import iuhv1 from './asset/iuhv1.png';


export const PaymentStatus = Object.freeze({
    PENDING: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    CANCELED: 'Hủy đơn',
});

const Payment = () => {
    const [paymentDetails, setPaymentDetails] = useState([]);
    const { userId } = useUser();
    const [userInfo, setUserInfo] = useState({});

    // chuyển hướng sang trang thanh toán
    const handlePayment = (checkoutUrl) => {
        window.location.href = checkoutUrl;
    };

    // get thông tin sinh viên
    const handleGetUserInfo = async (userId) => {
        try {
            const response = await axios.get(`${getUserByIdRoute}${userId}`);
            if (response.data && response.data.data) {
                setUserInfo(response.data.data);
            } else {
                console.error("Không tìm thấy thông tin người dùng.");
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };
    useEffect(() => {
        handleGetUserInfo(userId);
    }, []);

    // in hóa đơn
    const handlePrint = (payment, userInfo) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>In Hóa Đơn</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { display: flex; align-items: center; border: 2px solid black; padding: 10px; background-color: #f0f0f0; }
                        .des { margin-top: 20px; border: 2px solid black; padding: 10px; background-color: #f0f0f0; }
                        .logo { width: 100px; margin-right: 16px; }
                        .info { text-align: left; }
                        h1, h2, h3 { margin: 0; }
                        h4 { margin: 5px 0; }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px; 
                            background-image: url(${iuhv1}); 
                            background-size: contain; 
                            background-repeat: no-repeat; 
                            background-position: center; 
                        }
                        th, td { border: 1px solid black; padding: 10px; text-align: center; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        .footer { text-align: center; margin-top: 20px; font-style: italic; }
                        .student-info { margin-top: 10px; text-align: start; border: 2px solid black; padding: 10px; background-color: #f0f0f0; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img src="${iuh}" alt="Logo" class="logo" />
                        <div class="info">
                            <h2>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP. HỒ CHÍ MINH</h2>
                            <p>Mã số thuế: 0303237311</p>
                            <p>Địa chỉ: 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh</p>
                            <p>Điện thoại: (028) 38940390</p>
                        </div>
                    </div>
                    <div class="des">
                        <h3 style="text-align: center;">HÓA ĐƠN BÁN HÀNG (THU TIỀN KÝ TÚC XÁ)</h3>
                        <p style="text-align: center;">Ngày ${new Date(payment.paymentDate).getDate()} tháng ${new Date(payment.paymentDate).getMonth() + 1} năm ${new Date(payment.paymentDate).getFullYear()}</p>
                        <h4 style="text-align: center;">Thông tin khoản thu - Hóa đơn ${payment.orderCode}</h4>
                    </div>
                    <div class="student-info">
                        <h3 style="text-align: center;">Thông tin sinh viên</h3>
                        <p><strong>MSSV:</strong> ${userInfo.userId || 'N/A'}</p> 
                        <p><strong>Tên:</strong> ${userInfo.name || 'N/A'}</p> 
                        <p><strong>Email:</strong> ${userInfo.email || 'N/A'}</p> 
                        <p><strong>Điện thoại:</strong> ${userInfo.phone || 'N/A'}</p> 
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã khoản thu</th>
                                <th>Tên khoản thu</th>
                                <th>Phòng</th>
                                <th>Thành tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>${payment.orderCode}</td>
                                <td>${payment.description || 'N/A'}</td>
                                <td>${payment.roomNumber || 'N/A'}</td>
                                <td>${payment.amount ? `${payment.amount} VND` : 'N/A'}</td>
                                <td>${payment.status}</td>
                            </tr>
                            ${Array.from({ length: 10 }).map(() => `
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            `).join('')}
                            <tr>
                                <td colspan="4" style="text-align: right;"><strong>Tổng cộng:</strong></td>
                                <td>${payment.amount ? `${payment.amount} VND` : 'N/A'}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="table-overlay"></div>
                    <div class="footer">
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleGetDormPayment = () => {
        axios.get(`${getDormPaymentWithUserId}/${userId}`)
            .then((response) => {
                if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
                    setPaymentDetails(response.data.data.data);
                } else {
                    setPaymentDetails([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setPaymentDetails([]);
            });
    };

    useEffect(() => {
        handleGetDormPayment();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '90vh', padding: 4, backgroundColor: '#f5f5f5' }}>
            {
                paymentDetails.length === 0 ? (
                    <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>Không có hóa đơn nào.</Typography>
                ) :
                    (
                        paymentDetails.map((payment) => (
                            <Card key={payment._id} sx={{ width: '100%', maxWidth: 800, marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
                                <CardContent sx={{ padding: 2 }} id={payment.orderCode}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                        <img src={iuh} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: 16 }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP. HỒ CHÍ MINH</Typography>
                                            <Typography variant="body2">Mã số thuế: 0303237311</Typography>
                                            <Typography variant="body2">Địa chỉ: 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh</Typography>
                                            <Typography variant="body2">Điện thoại: (028) 38940390</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>HÓA ĐƠN BÁN HÀNG (THU TIỀN KÝ TÚC XÁ)</Typography>
                                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                        Ngày {new Date(payment.paymentDate).getDate()} tháng {new Date(payment.paymentDate).getMonth() + 1} năm {new Date(payment.paymentDate).getFullYear()}
                                    </Typography>

                                    <Box sx={{ marginTop: 2, borderRadius: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>Thông tin khoản thu - Hóa đơn {payment.orderCode}</Typography>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>STT</th>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Mã khoản thu</th>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Tên khoản thu</th>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Phòng</th>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Thành tiền</th>
                                                    <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>1</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{payment.orderCode}</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{payment.description || 'N/A'}</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{payment.roomNumber}</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{payment.amount ? `${payment.amount} VND` : 'N/A'}</td>
                                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{payment.status}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                            {
                                                payment.status === PaymentStatus.PENDING && (
                                                    <Button variant="contained" color="primary" onClick={() => handlePayment(payment.checkoutUrl)}>Thanh toán</Button>
                                                )
                                            }
                                            <Button variant="outlined" color="secondary" onClick={() => handlePrint(payment, userInfo)}>In</Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    )
            }


        </Box>
    );
};

export default Payment;
