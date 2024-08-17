import React, { useState, useEffect } from "react";
import "./GlowingCursor.css";

export default function GlowingCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <div
            className="glowing-cursor"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        />
    );
}
