import axios from "axios";
import { useUser } from "../Context/Context";
import { useEffect, useState } from "react";
import { getDormSubmissionByUserId } from "../API/APIRouter";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import { Typography, Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PaymentIcon from '@mui/icons-material/Payment';
import RoomIcon from '@mui/icons-material/Room';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const statusIcons = {
    PENDING: <HourglassEmptyIcon />,
    ACCEPTED: <CheckCircleIcon />,
    AWAITING_PAYMENT: <PaymentIcon />,
    PAID: <CheckCircleIcon />,
    ASSIGNED: <RoomIcon />,
    REJECTED: <CancelIcon />,
    ROOM_REQUESTED: <AssignmentIndIcon />,
};

const statusColors = {
    PENDING: "#FFD700",
    ACCEPTED: "#28a745",
    AWAITING_PAYMENT: "#FF8C00",
    PAID: "#28a745",
    ASSIGNED: "#007BFF",
    REJECTED: "#DC3545",
    ROOM_REQUESTED: "#6A1B9A",
};

const statusTranslations = {
    PENDING: "Chờ duyệt",
    ACCEPTED: "Chấp nhận",
    REJECTED: "Từ chối",
    PAID: "Đã thanh toán",
    ASSIGNED: "Đã xếp phòng",
    AWAITING_PAYMENT: "Vui lòng hanh toán",
    ROOM_REQUESTED: "Yêu cầu phòng",
};

const statusMessages = {
    PENDING: "Cần thời gian để duyệt đơn",
    ACCEPTED: "Chờ mở thanh toán",
    AWAITING_PAYMENT: "Bạn hãy tiến hành thanh toán",
    PAID: "Đang xếp phòng",
    REJECTED: "Đơn của bạn không hợp lệ",
    ASSIGNED: "Xếp phòng thành công",
    ROOM_REQUESTED: "Chờ đến hết thời gian mở đăng ký",
};

const TimeLineStudent = () => {
    const { userId } = useUser();
    const [dormSubmission, setDormSubmission] = useState(null);

    const getDormSubmissionByUserIdFunc = async () => {
        try {
            const response = await axios.get(`${getDormSubmissionByUserId}${userId}`);
            setDormSubmission(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getDormSubmissionByUserIdFunc();
    }, []);

    if (!dormSubmission) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 4,
                borderRadius: 2,
                maxWidth: 700,
                margin: '20px auto',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{ fontWeight: 600, color: '#333', marginBottom: 2 }}
            >
                Quá trình xử lý đơn
            </Typography>
            <Timeline position="alternate">
                {dormSubmission.statusHistory.map((status, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent
                            sx={{ m: 'auto 0', color: '#757575', fontSize: '0.875rem' }}
                            align="right"
                        >
                            {new Date(dormSubmission.updatedAt).toLocaleDateString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            {index !== 0 && <TimelineConnector />}
                            <TimelineDot
                                sx={{
                                    backgroundColor: statusColors[status],
                                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                {statusIcons[status]}
                            </TimelineDot>
                            {index !== dormSubmission.statusHistory.length - 1 && (
                                <TimelineConnector />
                            )}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '8px', px: 2 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: statusColors[status],
                                }}
                            >
                                {statusTranslations[status]}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#616161',
                                    marginTop: 0.5,
                                }}
                            >
                                {statusMessages[status]}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};

export default TimeLineStudent;
