import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ImportXLSX from './Import-xlsx/ImportXlxs'
import ImportRoom from './Import-room/ImportRoom';

import TotalStudent from './components/TotalStudent';
const Home = () => {
    return (
        <div className={style['home-container']}>
            <div>
                <TotalStudent />
                <ImportXLSX />
                <ImportRoom />
            </div>
        </div>
    );
};

export default Home;
