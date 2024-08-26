import React from 'react';
import MainMenu from '../Menu/MainMenu';

const Layout = ({ children, onLogout }) => {
    return (
        <div style={{ display: 'flex', backgroundColor: "#f2f3f5" }}>
            <MainMenu onLogout={onLogout} />
            <div style={{ marginLeft: 80, flexGrow: 1 }}>
                {children}
            </div>
        </div>
    );
};


export default Layout;
