import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Entypo from '@expo/vector-icons/Entypo';

const Profile = () => {
  return (
    <View style={styles.container}>
      <UserData />
    </View>
  );
};

export default Profile;

export const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://103.209.34.203:8081/api/v1/users/id/22670272');
        setUserData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // Hiển thị loading khi đang gọi API
  }

  if (!userData) {
    return <Text>Không có dữ liệu người dùng.</Text>; // Hiển thị nếu không có dữ liệu
  }

  return (
    <View>
      <View style={styles.userContainer}>
        <Image
          style={styles.userImage}
          source={{ uri: userData.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} // Sử dụng ảnh mặc định nếu không có
        />
        <Text style={styles.userName}>{userData.name}</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userId}>{userData.userId}</Text>
          <Entypo name="dot-single" size={24} color="black" />
          <Text style={styles.userClass}>{userData.class}</Text>
        </View>
        <Text style={styles.userDetail}>Email: {userData.email}</Text>
        <Text style={styles.userDetail}>Số điện thoại: {userData.phone}</Text>
        <Text style={styles.userDetail}>Địa chỉ: {userData.address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',
  },
  userContainer: {
    height: 250,
    width: "91%",
    backgroundColor: "#ffffff",
    marginHorizontal: 18,
    marginVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 5,
  },
  userInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  userId: {
    fontSize: 17,
  },
  userClass: {
    fontSize: 17,
  },
  userDetail: {
    fontSize: 16,
    color: "#555",
  },
});
