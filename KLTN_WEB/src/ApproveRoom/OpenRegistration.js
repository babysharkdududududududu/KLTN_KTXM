import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function OpenRegistration({ open, handleClose, handleOpen }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Mở đăng ký"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn mở đăng ký không? Hành động này sẽ cho phép người dùng đăng ký lại.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Hủy
        </Button>
        <Button onClick={() => { handleOpen(); handleClose(); }} autoFocus>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
}
