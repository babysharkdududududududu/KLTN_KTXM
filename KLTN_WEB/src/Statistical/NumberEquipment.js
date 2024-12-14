import axios from "axios";
import { getStatisticalEquipment } from "../API/APIRouter";
import { useEffect, useState } from "react";
import { FaBed, FaLightbulb, FaFan, FaTabletAlt, FaTools } from "react-icons/fa";
import { Grid, Paper } from "@mui/material";

const EquipmentItem = ({ name, count, color, icon: Icon }) => {
    return (
        <Paper
            elevation={3}
            style={{ width: "100%", height: "140px", backgroundColor: color, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "15px", color: "#fff", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer", }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <Icon size={36} color="#fff" style={{ marginRight: "10px" }} />
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{name}</h3>
            </div>
            <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>Số lượng: {count}</p>
        </Paper>
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
        <Grid container spacing={1} style={{ marginTop: "30px", }} justifyContent="space-evenly">
            {numberEquipment.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <EquipmentItem
                        name={item.name}
                        count={item.count}
                        color={colors[index % colors.length]}
                        icon={icons[index % icons.length]}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default NumberEquipment;
