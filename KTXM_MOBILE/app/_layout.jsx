import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Thông báo"
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Đăng ký"
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Hồ sơ"
                }}
            />
        </Tabs>
    );
}

export default _layout;
