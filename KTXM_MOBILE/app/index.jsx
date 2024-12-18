import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://103.209.34.203:8081/api/v1/rooms/G201');
        setData(response.data.data);
        setTotalMembers(response.data.data.room.users.length); // Sửa ở đây
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
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
        const response = await axios.get('http://103.209.34.203:8081/api/v1/rooms/G201'); // Cập nhật URL API của bạn
        setMembers(response.data.data.room.users); // Giả sử cấu trúc dữ liệu là như vậy
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
    return <Text>Loading...</Text>; // Hiển thị loading khi đang gọi API
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
