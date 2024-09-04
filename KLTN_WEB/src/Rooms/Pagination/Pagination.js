// Pagination.js
import React from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', bottom: 10, left: '43%' }}>
            <FormControl variant="outlined" style={{ margin: '0 8px' }}>
                <Select
                    value={currentPage}
                    onChange={(e) => onPageChange(e.target.value)} // Truyền giá trị trang
                    style={{ fontSize: '0.8rem', width: 80, height: 30 }}
                >
                    {Array.from({ length: totalPages }, (_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                            {index + 1}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography style={{ fontSize: '1rem' }}>
                Trang {currentPage} / {totalPages}
            </Typography>
        </div>
    );
};

export default Pagination;
