import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import style from './Room.module.css';
import TableData from './TableData';
import BLOCKG from "./assets/BLOCK_G.png";
import BLOCKI from "./assets/BLOCK_I.png";
import { useUser } from '../Context/Context';
import RoomStudent from './RoomStudent/RoomStudent';
import ImportRoom from '../Home/Import-room/ImportRoom';
import { Button } from '@mui/material';
import EquipmentUpload from '../Home/Import-equipment/ImportEquipment';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 150,
    height: 150,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

const Room = () => {
    const [filterBlock, setFilterBlock] = useState(null);
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

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: 'center', background: '#e7ecf0', width: '100%', }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: 'center', background: '#e7ecf0', width: '100%', height: '100%' }}>
                {
                    roleId === 'USERS' ?
                        <RoomStudent filterBlock={filterBlock} />
                        : <div style={{ width: '80%', height: '98vh', paddingTop: '10px' }}>
                            <TableData filterBlock={filterBlock} />
                        </div>
                }

                <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', height: "80%", marginLeft: 20 }}>
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
                                {/* {showImportRoom ? 'Ẩn Import Room' : 'Hiện Import Room'} */}
                                {showImportRoom ? 'Ẩn Import Room' : 'Hiện Import Room'}

                            </Button>
                            : null
                    }

                    {showImportRoom && <ImportRoom />}
                    {showImportRoom && <EquipmentUpload />}

                </div>
            </div>
        </div>
    );
}

export default Room;
