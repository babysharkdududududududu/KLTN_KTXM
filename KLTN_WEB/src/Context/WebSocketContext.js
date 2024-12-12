import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../Context/Context'

const WebSocketContext = createContext();


export const WebSocketProvider = ({ children }) => {
    const { userId, roleId } = useUser();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [numberNoti, setNumberNoti] = useState(0);
    const updateNotificationCount = (newCount) => {
        setNumberNoti(newCount);
    };

    useEffect(() => {
        const newSocket = io(`${process.env.SOCKET}`);
        setSocket(newSocket);

        newSocket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            setNumberNoti((prevNumberNoti) => prevNumberNoti + 1);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (message) => {
        if (socket) {
            socket.emit('message', { userId, roleId, message });
        }
    };

    return (
        <WebSocketContext.Provider value={{ messages, sendMessage, numberNoti, updateNotificationCount }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
