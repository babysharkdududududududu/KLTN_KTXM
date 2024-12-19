import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function Explore() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [numberNoti, setNumberNoti] = useState(0);

  useEffect(() => {
    // Kết nối socket
    const newSocket = io(process.env.REACT_APP_SOCKET || 'http://103.209.34.203:8081');
    console.log('Connecting to socket:', newSocket);

    setSocket(newSocket);

    newSocket.on('message', (message) => {
      setNotifications((prevNotifications) => [...prevNotifications, message]);
      setNumberNoti((prevNumberNoti) => prevNumberNoti + 1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://103.209.34.203:8081/api/v1/notification/get-all');
        setNotifications(response.data.data.results.reverse());
      } catch (error) {
        setError('Không thể tải thông báo. Vui lòng thử lại.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handlePress = (notification) => {
    setSelectedNotification(selectedNotification === notification ? null : notification);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        style={{ width: '100%' }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.notificationContainer}>
              <Text style={styles.title}>{item.title}</Text>
              {selectedNotification === item && (
                <Text style={styles.message}>{item.message}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.notificationCount}>Số thông báo mới: {numberNoti}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  notificationCount: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
