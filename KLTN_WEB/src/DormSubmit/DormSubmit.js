import React, { useEffect, useState } from "react";
import { Button, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'; // Import biểu tượng dấu X
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { submitDormRoute, checkSubmit, getUserByIdRoute } from '../API/APIRouter';
import { useUser } from '../Context/Context';
import sucessImage from './images/sucess.png';
import { Phone, Email, Home, AccountCircle, Class } from '@mui/icons-material';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 700,
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export default function DormSubmit() {
    const settingId = "675520c91c9534b31e2e8323";
    const { userId } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    const [note, setNote] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]); // Thay đổi thành mảng


    useEffect(() => {
        const checkRegistration = async () => {
            setLoading(true);
            try {
                const response = await fetch(checkSubmit, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        settingId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsRegistered(data.data.exists);
                } else {
                    console.error('Kiểm tra đăng ký không thành công:', response.statusText);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra đăng ký:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleGetUserInfo = async (userId) => {
            try {
                const response = await axios.get(`${getUserByIdRoute}${userId}`);
                if (response.data && response.data.data) {
                    const user = response.data.data;
                    setUserInfo(user);
                    setEmail(user.email);
                } else {
                    console.error("Không tìm thấy thông tin người dùng.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        checkRegistration();
        handleGetUserInfo(userId);
    }, [userId, settingId]);

    const handleSubmit = async () => {
        setErrorMessage("");

        // Tạo một đối tượng FormData
        const formData = new FormData();

        // Thêm dữ liệu vào FormData
        formData.append("userId", userId);
        formData.append("email", email);

        // Thêm các tệp đã chọn vào FormData
        selectedFiles.forEach(file => {
            formData.append("files", file); // Thêm tệp vào FormData
        });

        // Gửi yêu cầu đến server
        const response = await fetch(submitDormRoute, {
            method: 'POST',
            body: formData, // Gửi FormData
        });

        if (response.ok) {
            const data = await response.json();
            setIsRegistered(true);
        } else {
            const errorData = await response.json();
            setErrorMessage("Bạn không đủ điều kiện để đăng ký.");
            console.error('Đăng ký không thành công:', response.statusText);
        }
    };


    const handleCancelRegistration = async () => {
        setIsRegistered(false);
    };

    // Hàm để xóa file
    const handleRemoveFile = (fileToRemove) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileToRemove.name)); // Xóa file khỏi mảng
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/')); // Chỉ lấy các file hình ảnh

        if (imageFiles.length === 0) {
            setErrorMessage("Vui lòng chỉ tải lên các tệp hình ảnh.");
        } else {
            setSelectedFiles(prevFiles => [...prevFiles, ...imageFiles]);
            setErrorMessage("");
        }
    };

    return (
        <div style={{ padding: '20px', display: "flex", justifyContent: "center" }}>
            <DemoPaper>
                <Typography variant="h4" gutterBottom>Đăng ký phòng KTX</Typography>
                <Typography variant="body1" gutterBottom style={{ textAlign: 'left' }}>
                    Đối tượng được ưu tiên xét ở Ký túc xá là sinh viên có hoàn cảnh khó khăn, cụ thể các đối tượng gồm: <br />
                    - Sinh viên mồ côi cả cha lẫn mẹ <br />
                    - Sinh viên là con người có công với cách mạng; <br />
                    - Sinh viên là con của liệt sỹ; con của thương binh; con của người hưởng chế độ chính sách như thương binh; con của bệnh binh; con của người hoạt động kháng chiến bị nhiễm chất độc hóa học; con của Anh hùng lực lượng vũ trang nhân dân; con của Anh hùng lao động trong thời kỳ kháng chiến;<br />
                    - Sinh viên khuyết tật;<br />
                    - Sinh viên là con của người bị tai nạn lao động được hưởng trợ cấp thường xuyên;<br />
                    - Sinh viên thuộc diện hộ nghèo, hộ cận nghèo;<br />
                    - Sinh viên bị bệnh hiểm nghèo;<br />
                    - Sinh viên người dân tộc thiểu số ít người có khó khăn đặc thù: Ở Đu, B Râu, Rơ Măm, Pu Péo, Si La, Cống, Bố Y, Cơ Lao, Măng, Lô Lô, Chút, Lự, Pà Thẻn, La Ha.<br />
                    Sinh viên người dân tộc thuộc vùng kinh tế- xã hội khó khăn và đặc biệt khó khăn được xác định theo văn bản tại phụ lục I của Nghị định 81/2021/NĐ-CP ngày 27 tháng 8 năm 2021 của Chính phủ.<br />
                    - Sinh viên có hoàn cảnh đặc biệt khó khăn khác......<br />
                    <span style={{ color: 'blue' }}>
                        Sinh viên nếu thuộc một trong các trường hợp trên, upload giấy xác nhận của địa phương tại đây, trường hợp không thuộc bỏ qua
                    </span>
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : isRegistered ? (
                    <div>
                        <img src={sucessImage} alt="Đăng ký thành công" style={{ width: '100px', height: '100px' }} />
                        <Typography variant="h6">Bạn đã đăng ký thành công!</Typography>
                        <StyledButton variant="contained" color="error" onClick={handleCancelRegistration}>
                            Hủy đăng ký
                        </StyledButton>
                    </div>
                ) : (
                    <Grid container spacing={2} direction="column" style={{ marginTop: '20px', padding: '20px'}}>
                        {userInfo ? (
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <AccountCircle style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Mã số sinh viên: {userInfo.userId}</Typography>
                                    </Grid>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <AccountCircle style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Giới tính: {userInfo.gender}</Typography>
                                    </Grid>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <AccountCircle style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Họ tên: {userInfo.name}</Typography>
                                    </Grid>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <Phone style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Số điện thoại: {userInfo.phone}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <Email style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Email: {userInfo.email}</Typography>
                                    </Grid>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <Class style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Lớp: {userInfo.class}</Typography>
                                    </Grid>
                                    <Grid item container alignItems="center" sx={{ marginBottom: 1 }}>
                                        <Home style={{ marginRight: 5, color: '#1976d2' }} />
                                        <Typography variant="body1" fontWeight="bold">Địa chỉ: {userInfo.address}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography>Không tìm thấy thông tin người dùng.</Typography>
                        )}
                        {errorMessage && (
                            <Typography color="error">{errorMessage}</Typography>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 }}>
                            <Button
                                component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                />
                            </Button>
                            <StyledButton variant="contained" color="primary" style={{ marginTop: 0, marginLeft: 10, width: 160 }} onClick={handleSubmit} disabled={isRegistered}>
                                Đăng ký
                            </StyledButton>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div style={{ marginTop: 10 }}>
                                {selectedFiles.map((file, index) => (
                                    <Typography key={index} variant="body2" style={{ display: 'flex', alignItems: 'center' }}>
                                        File đã chọn: <strong>{file.name}</strong> {/* Sử dụng file.name */}
                                        <Button onClick={() => handleRemoveFile(file)} style={{ marginLeft: 10 }} color="error">
                                            <CloseIcon />
                                        </Button>
                                    </Typography>
                                ))}
                            </div>
                        )}



                    </Grid>
                )}
            </DemoPaper>
        </div>
    );
}
