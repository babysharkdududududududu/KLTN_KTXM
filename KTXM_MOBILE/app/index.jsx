import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('22670272');
  const [password, setPassword] = useState('ktxm@123');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    setLoginLoading(true);

    try {
      const response = await axios.post('http://103.209.34.203:8081/api/v1/auth/login', {
        username,
        password,
      });

      const { data } = response.data;

      // Lưu thông tin người dùng và token vào AsyncStorage
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await fetchContractAndRoomData(data.user.userId);
      setIsLoggedIn(true); // Đặt trạng thái đăng nhập ở đây
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
      console.error(error);
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchContractAndRoomData = async (userId) => {
    try {
      const contractResponse = await axios.get(`http://103.209.34.203:8081/api/v1/contracts/search?userId=${userId}`);
      const contractData = contractResponse.data.data;

      if (contractData.length > 0) {
        const roomNumber = contractData[0].roomNumber;
        await fetchData({ roomNumberData: roomNumber });
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy hợp đồng cho người dùng này.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async ({ roomNumberData }) => {
    try {
      const response = await axios.get(`http://103.209.34.203:8081/api/v1/rooms/${roomNumberData}`);
      setData(response.data.data);
      setTotalMembers(response.data.data.room.users.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#333', marginBottom: 20 }}>Đăng Nhập</Text>
        <TextInput
          style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 20 }}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleLogin} style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5, width: '100%', alignItems: 'center' }} disabled={loginLoading}>
          <Text style={{ color: '#fff' }}>{loginLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#f3f2f7" />
      <Header totalMembers={totalMembers} />
      <ScrollView>
        <ElectricNumber electricityNumber={data.room.electricityNumber} />
        <WaterNumber waterNumber={data.room.waterNumber} />
        <View style={{ width: '100%', justifyContent: 'center', flexDirection: "row", marginTop: 5 }}>
          <Explore />
        </View>
      </ScrollView>
    </View>
  );
};

const Header = ({ totalMembers }) => {
  return (
    <View style={{ width: '100%', height: 100, backgroundColor: '#f3f2f7', alignItems: "center", flexDirection: "row", padding: 8, justifyContent: "space-between", borderBottomLeftRadius: 25, borderBottomRightRadius: 25, paddingTop: 36 }}>
      <View style={{ padding: 5 }}>
        <Image
          source={{ uri: 'https://i.imgur.com/xWEzgng.png' }}
          style={{ width: 100, height: 50 }}
          resizeMode='contain'
        />
      </View>
      <View style={{ width: "40%", justifyContent: "center", alignItems: "flex-end", backgroundColor: '#fff', borderRadius: 15, padding: 6 }}>
        <Text style={{ fontSize: 20, color: '#37385d', fontWeight: "bold" }}>Phòng G201</Text>
        <Text style={{ fontSize: 17, color: '#37385d' }}>{totalMembers} thành viên</Text>
      </View>
    </View>
  );
};

const ElectricNumber = ({ electricityNumber }) => {
  return (
    <View style={{ width: '97%', height: 100, backgroundColor: '#fff', borderRadius: 25, margin: 5, alignItems: "center", flexDirection: "row", padding: 8, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="power-plug" size={25} color="#ff9b63" />
        </View>
        <View style={{ alignContent: "flex-start", marginLeft: 8 }}>
          <Text style={{ fontSize: 20, color: '#37385d' }}>Số điện tiêu thụ</Text>
          <Text style={{ fontSize: 17, color: '#37385d' }}>4 Thiết bị - Tháng 10</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20, color: '#37385d', fontWeight: 'bold' }}>{electricityNumber}</Text>
        <Text style={{ fontSize: 20, color: '#37385d' }}> kWh</Text>
      </View>
    </View>
  );
};

const WaterNumber = ({ waterNumber }) => {
  return (
    <View style={{ width: '97%', height: 100, backgroundColor: '#fff', borderRadius: 25, margin: 5, alignItems: "center", flexDirection: "row", padding: 8, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="water-outline" size={25} color="#1e6aff" />
        </View>
        <View style={{ alignContent: "flex-start", marginLeft: 8 }}>
          <Text style={{ fontSize: 20, color: '#37385d' }}>Số nước tiêu thụ</Text>
          <Text style={{ fontSize: 17, color: '#37385d' }}>Tháng 10</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20, color: '#37385d', fontWeight: 'bold' }}>{waterNumber}</Text>
        <Text style={{ fontSize: 20, color: '#37385d' }}> m³</Text>
      </View>
    </View>
  );
};

const Explore = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://103.209.34.203:8081/api/v1/rooms/G201');
        setMembers(response.data.data.room.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handlePress = (member) => {
    setSelectedMember(selectedMember === member ? null : member);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20, borderRadius: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>THÀNH VIÊN</Text>
      {members.map((member, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(member)}>
          <View style={{ backgroundColor: '#ffffff', padding: 15, marginVertical: 5, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 2 }}>
            <Text style={{ fontSize: 18, color: '#333' }}>{member.name}</Text>
            {selectedMember === member && (
              <Text style={{ fontSize: 16, color: '#555', marginTop: 5 }}>{member.details}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
