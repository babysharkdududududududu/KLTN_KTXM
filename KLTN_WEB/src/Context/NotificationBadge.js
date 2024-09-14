import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../Context/WebSocketContext';

const NotificationBadge = ({ position, style: customStyle }) => {
    const { numberNoti } = useWebSocket();
    const [prevNoti, setPrevNoti] = useState(numberNoti);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (numberNoti > prevNoti) {
            setIsShaking(true);

            // Stop shaking after 10 seconds
            const timer = setTimeout(() => setIsShaking(false), 10000);

            // Clean up the timer when the component unmounts
            return () => clearTimeout(timer);
        }

        // Update previous notification count
        setPrevNoti(numberNoti);
    }, [numberNoti, prevNoti]);

    if (numberNoti === 0) return null; // Hide if no notifications

    return (
        <div
            style={{
                position: 'absolute',
                ...position,
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '5px 10px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...customStyle
            }}
        >
            {numberNoti}
        </div>
    );
};

export default NotificationBadge;