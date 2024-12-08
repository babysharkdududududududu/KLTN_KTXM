import axios from "axios";
import { useUser } from "../../Context/Context";
import { getDisciplineRoute } from "../../API/APIRouter";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

const Discipline = () => {
    const [discipline, setDiscipline] = useState(null);
    const { userId } = useUser();

    const handleGetDiscipline = async () => {
        try {
            const rs = await axios.get(`${getDisciplineRoute}/${userId}`);
            setDiscipline(rs.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleGetDiscipline();
    }, []);

    return (
        <Box sx={{ borderRadius: '4px', height: '100%', paddingBottom: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="h6">Vi phạm</Typography>
            <Divider sx={{ marginBottom: 1 }} />
            {
                discipline === null ? (
                    <Typography variant="body2" color="success"><strong>Sinh viên không có vi phạm.</strong></Typography>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: discipline.violationCount > 3 ? '#FF0000' : (discipline.violationCount >= 1 ? '#FFA500' : '#00C853')
                                }}
                            >
                                <strong>Hình thức:</strong> {discipline.penalty || 'Không có hình thức'}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: discipline.violationCount > 3 ? '#FF0000' : (discipline.violationCount >= 1 ? '#FFA500' : '#00C853')
                                }}
                            >
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
