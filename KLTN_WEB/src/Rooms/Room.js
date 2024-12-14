
import React, { useState } from 'react';
import TableData from './TableData';
import { useUser } from '../Context/Context';
import RoomStudent from './RoomStudent/RoomStudent';
import StatusRoom from './StatusRoom';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { exportRoomRoute } from '../API/APIRouter';
import axios from 'axios';
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Room = () => {
    const [filterBlock, setFilterBlock] = useState('');
    const [showImportRoom, setShowImportRoom] = useState(false);

    const handleBlockClick = (block) => {
        console.log("Block clicked:", block);
        setFilterBlock(block);
    };

    const { roleId } = useUser();
    const { userId } = useUser();

    const handleImportRoomClick = () => {
        setShowImportRoom(!showImportRoom);
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            handleBlockClick(''); // Tất cả phòng
        } else if (newValue === 1) {
            handleBlockClick('G'); // Block G
        } else if (newValue === 2) {
            handleBlockClick('I'); // Block I
        }
    };

    const handleExportData = async () => {
        try {
            // Tạo URL với cả settingID và statusID
            const url = `${exportRoomRoute}?block=${filterBlock}`;
            const response = await axios.get(url, {
                responseType: 'blob', // Đặt kiểu phản hồi là blob để xử lý file
            });

            // Lấy tên file từ header (nếu backend đã thiết lập)
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'data.xlsx';

            if (contentDisposition && contentDisposition.includes('attachment')) {
                const matches = contentDisposition.match(/filename="?(.+)"?/);
                if (matches[1]) {
                    fileName = matches[1]; // Lấy tên file từ header
                }
            }

            // Tạo URL cho file tải về
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            // Tạo thẻ a để tải file
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', fileName); // Sử dụng tên file từ backend

            // Thêm thẻ a vào body và click để tải file
            document.body.appendChild(link);
            link.click();

            // Xóa thẻ a sau khi tải
            document.body.removeChild(link);
        } catch (error) {
            console.error("Có lỗi xảy ra khi xuất dữ liệu:", error);
        }
    };


    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: 'center', background: '#e7ecf0', width: '100%', }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: 'center', background: '#e7ecf0', width: '100%', height: '100%' }}>
                {
                    roleId === 'USERS' ?
                        <RoomStudent filterBlock={filterBlock} />
                        : <div style={{ width: '98%', height: '100%', paddingTop: '10px', marginTop: 8, backgroundColor: "#fff", borderRadius: 10, marginBottom: '20px' }}>
                            <StatusRoom handleExportData={handleExportData} />
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Tất cả phòng" {...a11yProps(0)} />
                                    <Tab label="Block G" {...a11yProps(1)} />
                                    <Tab label="Block I" {...a11yProps(2)} />
                                </Tabs>


                            </Box>
                            <TableData filterBlock={filterBlock} />
                        </div>
                }

                {/* <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', height: "80%", marginLeft: 20 }}>
                    <DemoPaper square={false} sx={{ marginTop: '10px', backgroundColor: "#eae9e3", marginBottom: '20px' }} onClick={() => handleBlockClick('')}>
                        <img src={BLOCKI} alt="BLOCKI" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>
                    <DemoPaper square={false} sx={{ backgroundColor: "#eae9e3" }} onClick={() => handleBlockClick('G')}>
                        <img src={BLOCKG} alt="BLOCKG" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>
                    <DemoPaper square={false} sx={{ marginTop: '10px', backgroundColor: "#eae9e3", marginBottom: '20px' }} onClick={() => handleBlockClick('I')}>
                        <img src={BLOCKI} alt="BLOCKI" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>

                    {
                        roleId === 'MANAGER' ?
                            <Button variant="contained" color="primary" onClick={handleImportRoomClick} sx={{ marginTop: 2 }}>
                                {showImportRoom ? 'Ẩn Import Room' : 'Hiện Import Room'}

                            </Button>
                            : null
                    }

                    {showImportRoom && <ImportRoom />}
                    {showImportRoom && <EquipmentUpload />}
                    {showImportRoom && <ImportX />}
                </div> */}
            </div>
        </div>
    );
}

export default Room;
