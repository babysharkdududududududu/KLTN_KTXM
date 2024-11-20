import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";

// Mẫu hoa
const Flower = () => (
    <svg
        width="50"
        height="50"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Tâm hoa */}
        <circle cx="200" cy="200" r="30" fill="#FFD700" stroke="#FFA500" strokeWidth="4" />

        {/* Cánh hoa */}
        {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8; // Góc quay mỗi cánh hoa
            const radian = (Math.PI / 180) * angle;
            const x1 = 200 + Math.cos(radian) * 70;
            const y1 = 200 + Math.sin(radian) * 70;
            const x2 = 200 + Math.cos(radian + Math.PI / 8) * 140;
            const y2 = 200 + Math.sin(radian + Math.PI / 8) * 140;
            const x3 = 200 + Math.cos(radian - Math.PI / 8) * 140;
            const y3 = 200 + Math.sin(radian - Math.PI / 8) * 140;

            return (
                <path
                    key={i}
                    d={`M200,200 Q${x1},${y1} ${x2},${y2} T${x3},${y3} Z`}
                    fill="#FFD700"
                    stroke="#FFA500"
                    strokeWidth="2"
                />
            );
        })}
    </svg>
);

// Hiệu ứng hoa rơi
const SpringFlowers = () => {
    const [flowers, setFlowers] = useState([]);

    // Hàm tạo vị trí hoa ngẫu nhiên
    const createFlower = () => {
        const x = Math.random() * window.innerWidth;
        const delay = Math.random() * 3000; // Thêm độ trễ ngẫu nhiên lâu hơn
        return {
            x,
            delay,
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setFlowers((prevFlowers) => [...prevFlowers, createFlower()]);
        }, 2000); // Thêm hoa mỗi 2 giây

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
            {flowers.map((flower, index) => (
                <FallingFlower key={index} x={flower.x} delay={flower.delay} />
            ))}
        </div>
    );
};

const FallingFlower = ({ x, delay }) => {
    const springStyle = useSpring({
        from: { transform: "translateY(-100px)", opacity: 1 },
        to: { transform: `translateY(${window.innerHeight}px)`, opacity: 0 },
        config: { tension: 30, friction: 50 }, // Giảm độ căng và ma sát để rơi chậm hơn
        delay,
    });

    return (
        <animated.div style={{ ...springStyle, position: "absolute", left: x }}>
            <Flower />
        </animated.div>
    );
};

export default SpringFlowers;
