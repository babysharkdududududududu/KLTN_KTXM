import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
const Home = () => {
    const navigate = useNavigate();

    const handleGoToRoom = () => {
        navigate('/room');
    };

    return (
        <div className={style['home-container']}>
            <h1>Chào mừng đến với trang chủ!</h1>
            <Button variant="contained" onClick={handleGoToRoom}>
                Contained
            </Button>
        </div>
    );
};

export default Home;
