// Combox.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Floor = ({ label, items, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select label={label} onChange={onChange}>
                {items.map((item, index) => (
                    <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Floor; 
