import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function StudentDetail({ open, handleClose, student }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const studentDocuments = Array.isArray(student?.documents) ? student.documents : [];
    
    const renderDocument = (doc, index) => {
        const imagePath = `/upload/${student.id}/${doc}`;
        const fileExtension = doc.split('.').pop().toLowerCase();

        // Chỉ chấp nhận hình ảnh
        if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
            return (
                <Card key={index} sx={{ maxWidth: 250 }}>
                    <CardMedia
                        component="img"
                        height="160"
                        image={imagePath}
                        alt={doc}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default.jpg';
                        }}
                        onClick={() => window.open(imagePath, '_blank')} // Mở hình trong tab mới khi nhấn
                        style={{ cursor: 'pointer' }} // Thêm con trỏ chuột khi di chuột lên hình
                    />
                </Card>
            );
        } else {
            return null; // Không hiển thị gì nếu không phải hình ảnh
        }
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: 'none' } }}
        >
            <DialogTitle>CHI TIẾT SINH VIÊN</DialogTitle>
            <DialogContent>
                {student ? (
                    <>
                        <DialogContentText>
                            <strong>MSSV:</strong> {student.id}<br />
                            <strong>Họ và tên:</strong> {student.fullName}<br />
                            <strong>Số điện thoại:</strong> {student.phoneNumber}<br />
                            <strong>Địa chỉ:</strong> {student.address}<br />
                            <strong>Phòng:</strong> {isNaN(student.roomNumber) ? 'Chưa có phòng' : student.roomNumber}<br />
                            <strong>Trạng thái:</strong> {getStatusLabel(student.status)}<br />
                        </DialogContentText>
                        <h3 style={{ textAlign: 'center' }}>Tài liệu đã tải lên:</h3>
                        {studentDocuments.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                                {studentDocuments.map(renderDocument)}
                            </div>
                        ) : (
                            <p style={{ textAlign: 'center' }}>Không có tài liệu nào đã tải lên.</p>
                        )}
                    </>
                ) : (
                    <DialogContentText>
                        Không có dữ liệu để hiển thị.
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Hàm để hiển thị trạng thái
const getStatusLabel = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ xử lý';
        case 'ACCEPTED':
            return 'Chấp nhận đơn đăng ký';
        case 'AWAITING_PAYMENT':
            return 'Chờ thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'ASSIGNED':
            return 'Đã xếp phòng';
        case 'REJECTED':
            return 'Từ chối đơn đăng ký';
        case 'ROOM_REQUESTED':
            return 'Yêu cầu phòng';
        default:
            return 'Không xác định';
    }
};
