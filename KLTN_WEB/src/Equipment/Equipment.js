import axios from "axios";
import { getAllEquipmentRoute, updateLocationEquipmentRoute } from "../API/APIRouter";
import { useEffect, useState } from "react";
import EquipmentList from './EquipmentList/EquipmentList';
import EquipmentDialog from './EquipmentDialog/EquipmentDialog';
import Pagination from './Pagination/Pagination';
import { Box, Tabs, Tab } from '@mui/material';
import PrintButton from "./PrintEquipment/PrintEquipment";
import EquipmentQRCode from "./EquipmentQR/EquipmentQR";

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [uniqueNameEquipment, setUniqueNameEquipment] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [updatedRoomNumber, setUpdatedRoomNumber] = useState('');
    const itemsPerPage = 20;
    const statusColors = { 1: '#4caf50', 2: '#1976d2', 3: '#ff9800', 4: '#9c27b0', 5: '#4caf50', 6: '#d32f2f' };
    const statusText = { 1: 'Hoạt động', 2: 'Kiểm tra', 3: 'Xử lý', 4: 'Sửa chữa', 5: 'Hoạt động', 6: 'Không sửa được' };
    // API get all equipment
    const handleGetAllEquipment = async () => {
        try {
            const rs = await axios.get(`${getAllEquipmentRoute}`);
            const equipmentData = rs.data.data;
            setEquipment(equipmentData);
            const nameEquipment = equipmentData.map((equip) => equip.name);
            const uniqueNames = Array.from(new Set(nameEquipment));
            setUniqueNameEquipment(uniqueNames);
        } catch (err) {
            console.error(err);
        }
    };
    // API update location equipment
    const handleUpdateLocationEquipment = async () => {
        if (selectedEquipment) {
            try {
                const rs = await axios.patch(`${updateLocationEquipmentRoute}/${selectedEquipment.equipNumber}`, { roomNumber: updatedRoomNumber });
                console.log(rs);
                handleCloseDialog();
                handleGetAllEquipment();
            } catch (err) {
                console.error(err);
            }
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEquipment(null);
        setUpdatedRoomNumber('');
    };
    const handleSelectEquipment = (equip) => {
        setSelectedEquipment(equip);
    };

    useEffect(() => {
        handleGetAllEquipment();
    }, []);

    const filteredEquipment = selectedTab === 0
        ? equipment
        : equipment.filter((equip) => equip.name === uniqueNameEquipment[selectedTab - 1]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEquipment = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Box sx={{ height: '100%', width: '100%', overflowX: 'hidden', marginTop: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                        <Tab label="Tất cả" />
                        {uniqueNameEquipment.map((name, index) => (
                            <Tab key={index} label={name} />
                        ))}
                    </Tabs>
                </Box>
                <Box sx={{ marginRight: '16px' }}> {/* Adjust the margin as needed */}
                    <PrintButton equipment={equipment} />
                </Box>
            </Box>

            {/* DS các thiết bị */}
            <EquipmentList equipment={currentEquipment} onCardClick={(equip) => {
                setSelectedEquipment(equip);
                setUpdatedRoomNumber(equip.roomNumber);
                setOpenDialog(true);
            }} />
            {/* phân trang */}
            <Pagination
                count={Math.ceil(filteredEquipment.length / itemsPerPage)}
                page={currentPage}
                onPageChange={(event, value) => setCurrentPage(value)}
            />
            {/* chi tiết thiết bị */}
            <EquipmentDialog
                open={openDialog}
                onClose={handleCloseDialog}
                equipment={selectedEquipment}
                updatedRoomNumber={updatedRoomNumber}
                onRoomNumberChange={setUpdatedRoomNumber}
                onUpdate={handleUpdateLocationEquipment}
            />
        </Box>
    );
};

export default Equipment;
