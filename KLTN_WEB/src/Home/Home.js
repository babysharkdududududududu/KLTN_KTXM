import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

import TotalStudent from './components/TotalStudent';
const Home = () => {
    return (
        <div className={style['home-container']}>
            <div>
                <TotalStudent />
            </div>
        </div>
    );
};

export default Home;
