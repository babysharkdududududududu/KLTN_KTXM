import * as React from 'react';
import Paper from '@mui/material/Paper';
import LoadingMedia from './LoadingMedia';
export default function InfoDetail() {
  return (
    <Paper sx={{ height: 550, width: '33%' }}>
        <LoadingMedia />
    </Paper>
  );
}
