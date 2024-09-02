import React, { useEffect, useState } from 'react';
import MainMenu from '../Menu/MainMenu';
import { useWebSocket } from '../Context/WebSocketContext';
const Layout = ({ children, onLogout }) => {
    const { messages } = useWebSocket();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            setDialogMessage(latestMessage.message);
            setOpenDialog(true); 
            console.log(latestMessage);
        }
    }, [messages]);
    return (
        <div style={{ display: 'flex' }}>
            <MainMenu onLogout={onLogout} />
            <div style={{ marginLeft: 80, flexGrow: 1 }}>
                {children}
            </div>
        </div>
    );
};


export default Layout;
