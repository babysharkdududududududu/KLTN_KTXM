import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Explore() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://103.209.34.203:8081/api/v1/notification/get-all'); // Cập nhật URL API
        // Đảo ngược thứ tự thông báo
        setNotifications(response.data.data.results.reverse()); // Lấy dữ liệu và đảo ngược
      } catch (error) {
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
    return <Text>Loading...</Text>; // Hiển thị loading khi đang gọi API
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        style={{ width: '100%' }}
        keyExtractor={(item) => item._id} // Sử dụng _id làm key
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
});
