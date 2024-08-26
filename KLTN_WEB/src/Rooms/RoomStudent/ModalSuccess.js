import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";

const ModalSuccess = ({ open, onClose, success = true }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', backgroundColor: success ? '#e0f7fa' : '#ffebee', padding: '16px', borderBottom: '2px solid', borderColor: success ? '#00796b' : '#d32f2f' }}>
                Thông báo
            </DialogTitle>
            <DialogContent style={{ padding: '16px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '8px', color: success ? '#00796b' : '#d32f2f', fontWeight: '500' }}>
                            {success ? 'Đăng ký phòng thành công!' : 'Đăng ký phòng thất bại!'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body1"
                            style={{ textAlign: 'center', color: '#555' }}>
                            {success ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.' : 'Vui lòng kiểm tra lại thông tin và thử lại.'}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
                <Button onClick={onClose} color="primary" ariant="contained"
                    style={{ backgroundColor: success ? '#00796b' : '#d32f2f', color: '#fff', padding: '8px 16px', '&:hover': { backgroundColor: success ? '#004d40' : '#b71c1c', } }}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalSuccess;
