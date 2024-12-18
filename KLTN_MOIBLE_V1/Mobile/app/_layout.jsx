import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ", // Bỏ chữ "Trang chủ"
                    header: () => (
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center', marginTop: 35, padding: 5}}>
                            <Image
                                source={{ uri: 'https://i.imgur.com/xWEzgng.png' }}
                                style={{ width: 100, height: 50 }}
                                resizeMode='contain'
                            />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Thành viên"
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
    )
}

export default _layout