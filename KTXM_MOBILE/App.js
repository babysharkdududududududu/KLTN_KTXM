import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import _layout from './app/_layout';
import LoginScreen from './app/login';
//status bar
import { StatusBar } from 'react-native';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
    const [user, setUser] = useState(null); // Thông tin người dùng
    const [token, setToken] = useState(null); // Token

    const handleLogin = (userData, accessToken) => {
        setUser(userData); // Lưu thông tin người dùng
        setToken(accessToken); // Lưu token
        setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
    };

    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            {isLoggedIn ? (
                <_layout user={user} token={token} /> // Hiển thị layout nếu đã đăng nhập
            ) : (
                <LoginScreen onLogin={handleLogin} /> // Hiển thị màn hình đăng nhập
            )}
        </NavigationContainer>
    );
}
