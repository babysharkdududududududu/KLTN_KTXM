import axios from "axios";
import { useUser } from "../../Context/Context";
import { getDisciplineRoute } from "../../API/APIRouter";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

const Discipline = () => {
    const [discipline, setDiscipline] = useState(null); // Khởi tạo là null
    const { userId } = useUser();

    const handleGetDiscipline = async () => {
        try {
            const rs = await axios.get(`${getDisciplineRoute}/${userId}`);
            console.log(rs.data.data); // Kiểm tra dữ liệu trả về
            setDiscipline(rs.data.data); // Cập nhật discipline với dữ liệu trả về
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleGetDiscipline();
    }, []);

    return (
        <Box sx={{ padding: 1, borderRadius: '4px', height: '100%', paddingBottom: 2 }}>
            <Typography variant="h6">Vi phạm</Typography>
            <Divider sx={{ marginBottom: 1 }} />
            {
                discipline === null ? ( // Kiểm tra nếu dữ liệu chưa sẵn sàng
                    <Typography variant="body2" color="success"><strong>Sinh viên không có vi phạm.</strong></Typography>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color={discipline.violationCount > 3 ? "error" : "warning"}>
                                <strong>Hình thức:</strong> {discipline.penalty || 'Không có hình thức'}
                            </Typography>
                            <Typography variant="caption" color={discipline.violationCount > 3 ? "error" : (discipline.violationCount >= 1 ? "warning" : "success")}>
                                <strong>Số lần:</strong> {discipline.violationCount || 0}
                            </Typography>
                        </Box>

                        {
                            discipline.descriptions && discipline.descriptions.length > 0 ? (
                                <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', textAlign: 'left', }}>
                                    {discipline.descriptions.slice(0, 4).map((description) => (
                                        <Box key={description._id}>
                                            <Typography fontSize={'10px'}><strong>Nội dung:</strong> {description.content}</Typography>
                                            <Typography fontSize={'10px'}><strong>Ngày:</strong> {new Date(description.violationDate).toLocaleDateString()}</Typography>
                                            <Typography fontSize={'10px'}><strong>Loại: </strong>{description.violationType}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2">Không có nội dung nào.</Typography>
                            )
                        }
                    </>
                )
            }
        </Box>
    );
};

export default Discipline;
