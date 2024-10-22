// import React, { useEffect } from 'react';
// import { Button, Container, Typography } from '@mui/material';

// const SuccessPage = () => {
//     useEffect(() => {
//         // Thay đổi lịch sử trình duyệt
//         window.history.pushState(null, '', window.location.href);
//         const handlePopState = (event) => {
//             // Ngăn chặn người dùng quay lại
//             window.history.pushState(null, '', window.location.href);
//         };

//         window.addEventListener('popstate', handlePopState);

//         // Cleanup
//         return () => {
//             window.removeEventListener('popstate', handlePopState);
//         };
//     }, []);

//     const handleConfirm = () => {
//         alert('Bạn đã xác nhận quét mã thành công!');
//     };

//     return (
//         <Container
//             maxWidth="sm"
//             style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 backgroundColor: '#f5f5f5'
//             }}
//         >
//             <Typography variant="h4" component="h1" gutterBottom>
//                 Quét mã thành công!
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//                 Bạn đã quét mã thành công. Vui lòng nhấn nút bên dưới để xác nhận.
//             </Typography>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleConfirm}
//                 style={{ marginTop: '20px' }}
//             >
//                 Xác nhận
//             </Button>
//         </Container>
//     );
// };

// export default SuccessPage;


import React, { useState } from 'react';
import { Button, Container, Typography, Paper, Dialog, DialogContent } from '@mui/material';
import Lottie from 'lottie-react';
import confirmAnimation from './asset/confirm.json';
import successAnimation from './asset/check.json';

const SuccessPage = () => {
    const [open, setOpen] = useState(false);
    const handleConfirm = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };
    return (
        <>
            <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '0', backgroundColor: 'transparent', }}>
                <Lottie animationData={confirmAnimation} loop={true} style={{ width: '250px', height: '250px', textAlign: 'center', alignSelf: 'center', }} />
                <Paper style={{ textAlign: 'center', backgroundColor: 'transparent', boxShadow: 'none', }}>
                    <Typography variant="h4" component="h1" style={{ color: '#334155', fontWeight: 'bold', }}>Quét mã thành công!</Typography>
                    <Typography variant="body1" style={{ fontStyle: 'italic' }}>Bạn đã quét mã thành công. Vui lòng nhấn nút bên dưới để xác nhận.</Typography>
                    <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginTop: '10px' }}>Xác nhận</Button>
                </Paper>
            </Container>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "transparent" }}>
                    <Lottie animationData={successAnimation} loop={false} style={{ width: '250px', height: '250px', textAlign: 'center', alignSelf: 'center', }} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SuccessPage;






