import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, Grid, Box, Divider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import DataTable from "./DataTable";
import BasicModal from './BasicModal';
import SucessfullModal from './SucessfullModal';
import InfoDetail from "./InfoDetail";

import { getSettingRoute } from '../API/APIRouter';

const ApproveRoom = () => {
    const [open, setOpen] = React.useState(false);
    const [setingID, setSetingID] = React.useState('');
    const [setting, setSetting] = React.useState([]);
    const [openSucessfull, setOpenSucessfull] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenSucessfull = () => {
        setOpenSucessfull(true);
        setTimeout(() => {
            setOpenSucessfull(false);
        }, 2000);
    };
    const handleCloseSucessfull = () => setOpenSucessfull(false);

    const handleChange = (event) => {
        setSetingID(event.target.value);
    };

    // Fetch API data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getSettingRoute);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSetting(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div style={{ padding: '20px', marginLeft: '25px', position: 'relative' }}>
            {setingID && (
                <BasicModal setingID={setingID} open={open} handleClose={handleClose} handleOpenSucessfull={handleOpenSucessfull} />
            )}
            <SucessfullModal open={openSucessfull} handleClose={handleCloseSucessfull} />
            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
                <Typography variant="h6" style={{ flex: 1 }}>Danh sách đơn đăng ký</Typography>

                <FormControl sx={{ minWidth: 120 }}>
                    <Select
                        value={setingID}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: 35, width: 180 }}
                    >
                        <MenuItem value="">
                            <em>Không</em>
                        </MenuItem>
                        {setting.map((item) => (
                            <MenuItem key={item._id} value={item._id} sx={{ width: 180 }}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div style={{ height: "50px", alignItems: 'center', display: 'flex', marginLeft: "10px" }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '20px' }} disabled={!setingID}>Tự động xếp phòng</Button>
                    <Button variant="contained" color="primary" onClick={handleOpen} disabled={!setingID}>Cài đặt</Button>
                </div>
            </div>

            {/* Chỉ hiển thị DataTable và InfoDetail khi đã chọn một MenuItem */}
            {setingID && (
                <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: '10px' }}>
                    <DataTable />
                    <InfoDetail />
                </div>
            )}
        </div>
    );
};

export default ApproveRoom;
