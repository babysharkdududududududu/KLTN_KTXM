import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
const Home = () => {
    return (
        <div className={style['home-container']}>
            <div>
                <p>say hi</p>
            </div>
        </div>
    );
};

export default Home;
