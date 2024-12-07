import { View, Text, Image } from 'react-native';
import React from 'react';
import ColorList from '../components/ColorList';
import Entypo from '@expo/vector-icons/Entypo';

const Profile = () => {
  return (
    <View>
      <UserData />
    </View>
  );
};

export default Profile;

export const UserData = () => {
  return (
    <View>
      <View style={{ height: 250, width: "91%", backgroundColor: "#ffffff", marginHorizontal: 18, marginVertical: 18, justifyContent: "center", alignItems: "center", borderRadius: 15, paddingHorizontal: 10 }}>
        <Image style={{ height: 80, width: 80, borderRadius: 50 }} source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} />
        <Text style={{ fontSize: 20, fontWeight: "600", marginVertical: 5 }}>Nguyễn Thanh Tùng</Text>
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={{ fontSize: 17 }}>20017271</Text>
          <Entypo name="dot-single" size={24} color="black" />
          <Text style={{ fontSize: 17 }}>Phòng G202</Text>
        </View>
        <Text style={{ fontSize: 16, color: "#555" }}>Email: taylor.swift@example.com</Text>
        <Text style={{ fontSize: 16, color: "#555" }}>Số điện thoại: 0123456789</Text>
        <Text style={{ fontSize: 16, color: "#555" }}>Địa chỉ: 370/6 Lê Hồng Phong, tổ 1 phường Phú Hoà, Tp. Thủ Dầu Một, Bình Dương.</Text>
      </View>
    </View>
  );
};
