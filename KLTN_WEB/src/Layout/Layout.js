
import React, { useEffect, useState, useRef } from 'react';
import MainMenu from '../Menu/MainMenu';
import { useWebSocket } from '../Context/WebSocketContext';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Layout = ({ children, onLogout }) => {
    const { messages } = useWebSocket();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false); // Menu mặc định ẩn
    const menuRef = useRef(null); // Ref để theo dõi menu

    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            setDialogMessage(latestMessage.message);
            setOpenDialog(true);
            console.log(latestMessage);
        }
    }, [messages]);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div style={{ display: 'flex', background: "#e7ecf0", height: '10%' }}>
            <IconButton
                onClick={toggleMenu}
                style={{
                    position: menuOpen ? 'absolute' : 'fixed',
                    top: menuOpen ? 10 : 10,
                    left: menuOpen ? 100 : 10, // Dời sang phải khi mở
                    zIndex: 1001,
                    transition: 'left 0.3s',
                }}
            >
                <MenuIcon />
            </IconButton>
            {menuOpen && (
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <MainMenu onLogout={onLogout} />
                </div>
            )}
            <div style={{ marginLeft: menuOpen ? 80 : 0, flexGrow: 1, transition: 'margin-left 0.9s' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;




// import React, { useEffect, useState } from 'react';
// import MainMenu from '../Menu/MainMenu';
// import { useWebSocket } from '../Context/WebSocketContext';
// const Layout = ({ children, onLogout }) => {
//     const { messages } = useWebSocket();
//     const [openDialog, setOpenDialog] = useState(false);
//     const [dialogMessage, setDialogMessage] = useState('');

//     useEffect(() => {
//         if (messages.length > 0) {
//             const latestMessage = messages[messages.length - 1];
//             setDialogMessage(latestMessage.message);
//             setOpenDialog(true);
//             console.log(latestMessage);
//         }
//     }, [messages]);
//     return (
//         <div style={{ display: 'flex', background: "#e7ecf0" }}>
//             <MainMenu onLogout={onLogout} />
//             <div style={{ marginLeft: 80, flexGrow: 1 }}>
//                 {children}
//             </div>
//         </div>
//     );
// };


