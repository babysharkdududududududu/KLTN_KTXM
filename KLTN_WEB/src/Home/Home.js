import React from "react";
import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ImportXLSX from './Import-xlsx/ImportXlxs';
import ImportRoom from './Import-room/ImportRoom';
import BasicModal from './components/BasicModal';
import TotalStudent from './components/TotalStudent';

const Home = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className={style['home-container']}>
            <div>
                <TotalStudent />
                <ImportXLSX />
                <ImportRoom />
                <BasicModal handleClose={handleClose} open={open} />
                <Button onClick={handleOpen}>Click me</Button>
            </div>
        </div>
    );
};

export default Home;
