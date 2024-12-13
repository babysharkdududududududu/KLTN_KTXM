import axios from "axios";
import { getStatisticalEquipment } from "../API/APIRouter";
import { useEffect, useState } from "react";
import { FaBed, FaLightbulb, FaFan, FaTabletAlt, FaTools } from "react-icons/fa";

const EquipmentItem = ({ name, count, color, icon: Icon }) => {
    return (
        <div
            style={{
                width: "200px",
                height: "120px",
                backgroundColor: color,
                padding: "20px",
                margin: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                color: "#fff",
                transition: "transform 0.3s",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Icon size={32} color="#fff" style={{ marginRight: "8px" }} />
                <h3 style={{ margin: 0, fontSize: "18px" }}>{name}</h3>
            </div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Số lượng: {count}</p>
        </div>
    );
};

const NumberEquipment = () => {
    const [numberEquipment, setNumberEquipment] = useState([]);
    const colors = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8"];
    const icons = [FaBed, FaLightbulb, FaFan, FaTabletAlt, FaTools];

    const getNumberEquipment = async () => {
        try {
            const response = await axios.get(`${getStatisticalEquipment}`);
            setNumberEquipment(response.data.data);
        } catch (error) {
            console.error("Error fetching number equipment:", error);
        }
    };

    useEffect(() => {
        getNumberEquipment();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "20px",
            }}
        >
            {numberEquipment.map((item, index) => (
                <EquipmentItem
                    key={index}
                    name={item.name}
                    count={item.count}
                    color={colors[index % colors.length]} // Áp dụng màu sắc theo thứ tự tuần hoàn
                    icon={icons[index % icons.length]} // Áp dụng biểu tượng theo thứ tự tuần hoàn
                />
            ))}
        </div>
    );
};

export default NumberEquipment;
