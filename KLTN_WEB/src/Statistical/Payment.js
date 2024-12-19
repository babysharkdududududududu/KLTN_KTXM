import axios from "axios";
import { getPaymentNumber } from "../API/APIRouter";
import { useEffect, useState } from "react";
import { FaFileInvoiceDollar, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import { Grid, Paper } from "@mui/material";

// Payment Item Component
const PaymentItem = ({ name, count, color, icon: Icon }) => {
    return (
        <Paper
            elevation={3}
            style={{
                width: "100%", height: "40px", backgroundColor: color, padding: "30px", display: "flex",
                flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "15px", color: "#fff",
                transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer",
            }}
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

// Payment Component
const Payment = () => {
    const [numberPayment, setNumberPayment] = useState({});
    const colors = ["#007bff", "#28a745", "#f44336"];
    const icons = [FaFileInvoiceDollar, FaMoneyBillWave, FaMoneyCheckAlt];

    const getPaymentData = async () => {
        try {
            const response = await axios.get(`${getPaymentNumber}`);
            setNumberPayment(response.data.data.count);
        } catch (error) {
            console.error("Error fetching payment data:", error);
        }
    };

    useEffect(() => {
        getPaymentData();
    }, []);

    const data = [
        { name: "Tổng hóa đơn", count: numberPayment.paid + numberPayment.unpaid || 0, color: colors[0], icon: icons[0] },
        { name: "Đã thanh toán", count: numberPayment.paid || 0, color: colors[1], icon: icons[1] },
        { name: "Chưa thanh toán", count: numberPayment.unpaid || 0, color: colors[2], icon: icons[2] },
    ];

    return (
        <Grid container spacing={1} style={{ marginTop: "10px" }} justifyContent="space-evenly">
            {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={3.2} key={index}>
                    <PaymentItem
                        name={item.name}
                        count={item.count}
                        color={item.color}
                        icon={item.icon}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default Payment;
