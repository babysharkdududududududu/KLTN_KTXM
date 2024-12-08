
// import React, { useEffect, useState, useRef } from 'react';
// import MainMenu from '../Menu/MainMenu';
// import { useWebSocket } from '../Context/WebSocketContext';
// import { IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// const Layout = ({ children, onLogout }) => {
//     const { messages } = useWebSocket();
//     const [openDialog, setOpenDialog] = useState(false);
//     const [dialogMessage, setDialogMessage] = useState('');
//     const [menuOpen, setMenuOpen] = useState(false);
//     const menuRef = useRef(null);
//     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth <= 768);
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     useEffect(() => {
//         if (messages.length > 0) {
//             const latestMessage = messages[messages.length - 1];
//             setDialogMessage(latestMessage.message);
//             setOpenDialog(true);
//             console.log(latestMessage);
//         }
//     }, [messages]);

//     const toggleMenu = () => {
//         setMenuOpen((prev) => !prev);
//     };

//     return (
//         <div style={{ display: 'flex', background: "#e7ecf0" }}>
//             {!isMobile && (
//                 <IconButton
//                     onClick={toggleMenu}
//                     style={{
//                         position: menuOpen ? 'absolute' : 'fixed',
//                         top: 10,
//                         left: menuOpen ? 80 : 10,
//                         zIndex: 1001,
//                         transition: 'left 0.3s',
//                     }}
//                 >
//                     <MenuIcon />
//                 </IconButton>
//             )}
//             {menuOpen && (
//                 <div ref={menuRef} style={{ position: 'relative' }}>
//                     <MainMenu onLogout={onLogout} />
//                 </div>
//             )}
//             <div style={{ marginLeft: menuOpen ? 80 : 0, flexGrow: 1, transition: 'margin-left 0.9s' }}>
//                 {children}

//             </div>
//         </div>
//     );
// };

// export default Layout;



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
        <div style={{ display: 'flex', background: "#e7ecf0" }}>
            <MainMenu onLogout={onLogout} />
            <div style={{ marginLeft: 80, flexGrow: 1 }}>
                {children}
            </div>
        </div>
    );
};
export default Layout;

