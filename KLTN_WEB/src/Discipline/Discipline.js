import axios from "axios";
import { getAllUserRoute } from "../API/APIRouter";
import { useEffect, useState } from "react";

const Discipline = () => {
    const [userData, setUserData] = useState([]);

    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            setUserData(response.data.data.results);
            console.log(response.data.data.results);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
    };

    useEffect(() => {
        handleGetAllUser();
    }, []);
    return (
        <div>
            <h1>Discipline</h1>
        </div>
    );
}
export default Discipline;