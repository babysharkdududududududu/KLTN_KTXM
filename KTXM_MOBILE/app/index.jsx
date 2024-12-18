import { View, Text, Switch, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

const Home = () => {
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
    <ScrollView>
      <View>
        <Header totalMembers={totalMembers} /> {/* Truyền totalMembers vào Header */}
        <View style={{ width: '100%', justifyContent: 'center', flexDirection: "row", marginTop: 5 }}>
          <LightRoom equipment={data.equipment} />
          <FanRoom equipment={data.equipment} />
        </View>
        <ElectricNumber electricityNumber={data.room.electricityNumber} />
        <WaterNumber waterNumber={data.room.waterNumber} />
      </View>
    </ScrollView>
  );
};

const Header = ({ totalMembers }) => { // Nhận totalMembers như một prop
  return (
    <View style={{ width: '97%', height: 80, backgroundColor: '#fff', borderRadius: 15, margin: 5, alignItems: "center", flexDirection: "row", padding: 8, justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <Entypo name="home" size={24} color="black" />
        </View>
        <View style={{ alignContent: "flex-start", marginLeft: 8 }}>
          <Text style={{ fontSize: 20, color: '#37385d' }}>Phòng G201</Text>
          <Text style={{ fontSize: 17, color: '#37385d' }}>{totalMembers} thành viên</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Ionicons name="notifications" size={24} color="#ff9b63" />
      </View>
    </View>
  );
};

const LightRoom = ({ equipment }) => {
  const [isMainLightEnabled, setIsMainLightEnabled] = useState(false);
  const [isBathroomLightEnabled, setIsBathroomLightEnabled] = useState(false);

  const toggleMainLightSwitch = () => setIsMainLightEnabled(previousState => !previousState);
  const toggleBathroomLightSwitch = () => setIsBathroomLightEnabled(previousState => !previousState);

  const mainLight = equipment.find(equip => equip.name === "Đèn" && equip.equipNumber === "d01");
  const bathroomLight = equipment.find(equip => equip.name === "Đèn" && equip.equipNumber === "d02");

  return (
    <View style={{ width: '46%', height: 270, backgroundColor: '#fff', borderRadius: 25, margin: 5, alignItems: "center" }}>
      {/* Main Light Switch */}
      <View style={{ width: '100%', flexDirection: 'row', padding: 8, justifyContent: "space-between", alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <Entypo name="light-bulb" size={22} color={isMainLightEnabled ? "#ff9b63" : "#37385d"} />
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isMainLightEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleMainLightSwitch}
          value={isMainLightEnabled}
        />
      </View>
      <View style={{ width: '100%', padding: 8 }}>
        <Text style={{ fontSize: 20, color: '#37385d' }}>Bóng đèn</Text>
        <Text style={{ fontSize: 17, color: '#37385d' }}>Phòng chính</Text>
      </View>
      <View style={{ borderWidth: 0.5, borderColor: "#e5e6f2", width: '80%' }} />

      {/* Bathroom Light Switch */}
      <View style={{ width: '100%', flexDirection: 'row', padding: 8, justifyContent: "space-between", alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <Entypo name="light-bulb" size={22} color={isBathroomLightEnabled ? "#ff9b63" : "#37385d"} />
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isBathroomLightEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleBathroomLightSwitch}
          value={isBathroomLightEnabled}
        />
      </View>
      <View style={{ width: '100%', padding: 8 }}>
        <Text style={{ fontSize: 20, color: '#37385d' }}>Bóng đèn</Text>
        <Text style={{ fontSize: 17, color: '#37385d' }}>Nhà vệ sinh</Text>
      </View>
    </View>
  );
};

const FanRoom = ({ equipment }) => {
  const [isFanEnabled, setIsFanEnabled] = useState(false);
  const toggleFanSwitch = () => setIsFanEnabled(previousState => !previousState);

  const fan = equipment.find(equip => equip.name === "Quạt" && equip.equipNumber === "q01");

  return (
    <View style={{ width: '46%', height: 135, backgroundColor: '#fff', borderRadius: 25, margin: 5, alignItems: "center" }}>
      <View style={{ width: '100%', flexDirection: 'row', padding: 8, justifyContent: "space-between", alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, borderRadius: 25, backgroundColor: "#f7f7f9", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="fan" size={22} color={isFanEnabled ? "#ff9b63" : "#37385d"} />
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isFanEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleFanSwitch}
          value={isFanEnabled}
        />
      </View>
      <View style={{ width: '100%', padding: 8 }}>
        <Text style={{ fontSize: 20, color: '#37385d' }}>Quạt</Text>
        <Text style={{ fontSize: 17, color: '#37385d' }}>Phòng chính</Text>
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

export default Home;
