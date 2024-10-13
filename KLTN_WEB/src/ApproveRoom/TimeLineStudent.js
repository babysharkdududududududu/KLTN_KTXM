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
import { Typography } from '@mui/material';
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
    PENDING: "#FFCC00",
    ACCEPTED: "#4CAF50",
    AWAITING_PAYMENT: "#FF9800",
    PAID: "#4CAF50",
    ASSIGNED: "#2196F3",
    REJECTED: "#F44336",
    ROOM_REQUESTED: "#9C27B0",
};

const statusTranslations = {
    PENDING: "Chờ duyệt",
    ACCEPTED: "Chấp nhận",
    REJECTED: "Từ chối",
    PAID: "Đã thanh toán",
    ASSIGNED: "Đã xếp phòng",
    AWAITING_PAYMENT: "Chờ thanh toán",
    ROOM_REQUESTED: "Yêu cầu phòng",
};

const statusMessages = {
    PENDING: "Cần thời gian để duyệt đơn",
    ACCEPTED: "Mời bạn thanh toán",
    AWAITING_PAYMENT: "Chờ thanh toán",
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
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</div>;
    }

    const isRoomAssigned = dormSubmission.statusHistory.includes('ASSIGNED');

    return (
        <div style={{ padding: '30px', backgroundColor: '#f7f9fc', borderRadius: '16px', maxWidth: '900px', margin: '40px auto', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Timeline position="alternate">
                {
                    dormSubmission.statusHistory.map((status, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                align={index % 2 === 0 ? "right" : "left"}
                                variant="body2"
                                color="text.secondary"
                            >
                                {new Date(dormSubmission.updatedAt).toLocaleDateString()}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary" style={{ backgroundColor: statusColors[status] }}>
                                    {statusIcons[status]}
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h6" component="span">
                                    {statusTranslations[status]}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {statusMessages[status]}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                }
            </Timeline>
            {isRoomAssigned && (
                <Typography variant="body1" align="center" style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
                    Bạn đã được xếp phòng, bạn có thể kiểm tra thông tin phòng nhé!
                </Typography>
            )}
        </div>
    );
};

export default TimeLineStudent;
