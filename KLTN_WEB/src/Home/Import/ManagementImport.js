import { Box, Container, Divider, Typography, Button, Snackbar } from "@mui/material";
import { useState } from "react";

const Management = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleImportData = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Box sx={{ borderRadius: 2, maxWidth: 800, minHeight: 150, background: '#f5f5f5', }}>
                <Typography gutterBottom sx={{ fontFamily: 'Tahoma', marginTop: '-20px' }} variant="h6">
                    Quản lý nhập dữ liệu
                </Typography>
                <Divider />
                <Typography container spacing={2} alignItems="center" sx={{ marginTop: 1, color: 'red' }}>
                    Bạn chỉ nên thực hiện chức năng này khi có việc thay đổi dữ liệu lớn.
                </Typography>
            </Box>
        </Container>
    );
};

export default Management;
