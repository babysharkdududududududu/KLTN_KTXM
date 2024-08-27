import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import style from './Room.module.css';
import TableData from './TableData';
import BLOCKG from "./assets/BLOCK_G.png";
import BLOCKI from "./assets/BLOCK_I.png";
import { useUser } from '../Context/Context';
import RoomStudent from './RoomStudent/RoomStudent';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 150,
    height: 150,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

const Room = () => {
    const [filterBlock, setFilterBlock] = useState(null);

    const handleBlockClick = (block) => {
        console.log("Block clicked:", block);
        console.log(roleId);
        console.log(userId);
        setFilterBlock(block);
    };

    const { roleId } = useUser();
    const { userId } = useUser();

    return (
        <div className={style['room-container']}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", height: "100%", alignContent: 'center' }}>
                {
                    roleId === 'USERS' ?
                        <RoomStudent filterBlock={filterBlock} />
                        : <div style={{ width: '80%', height: '98vh', paddingTop: '10px' }}>
                            <TableData filterBlock={filterBlock} />
                        </div>
                }
                <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', height: "100%", marginLeft: 20 }}>
                    <DemoPaper square={false} sx={{ marginTop: '10px', backgroundColor: "#eae9e3", marginBottom: '20px' }} onClick={() => handleBlockClick('')}>
                        <img src={BLOCKI} alt="BLOCKI" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>
                    <DemoPaper square={false} sx={{ backgroundColor: "#eae9e3" }} onClick={() => handleBlockClick('G')}>
                        <img src={BLOCKG} alt="BLOCKG" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>
                    <DemoPaper square={false} sx={{ marginTop: '10px', backgroundColor: "#eae9e3", marginBottom: '20px' }} onClick={() => handleBlockClick('I')}>
                        <img src={BLOCKI} alt="BLOCKI" style={{ width: '140px', height: '140px' }} />
                    </DemoPaper>
                </div>
            </div>
        </div>
    );
}

export default Room;
