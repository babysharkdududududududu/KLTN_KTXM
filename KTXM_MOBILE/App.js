import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SocketProvider } from '././socket/SocketProvider';
import _layout from './app/_layout';
import { StatusBar } from 'react-native';

export default function App() {
    return (
        <SocketProvider>
            <NavigationContainer>
                <StatusBar barStyle="dark-content" />
                <_layout />
            </NavigationContainer>
        </SocketProvider>
    );
}
