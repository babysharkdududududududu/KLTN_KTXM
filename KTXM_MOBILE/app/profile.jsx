import { View, Text, Image } from 'react-native'
import React from 'react'
import ColorList from '../components/ColorList'
import Entypo from '@expo/vector-icons/Entypo';

const Profile = () => {
  return (
    <View>
      <UserData />

    </View>
  )
}

export default Profile

export const UserData = () => {
  return (
    <View>
      <View style={{ height: 200, width: "91%", backgroundColor: "#ffffff", marginHorizontal: 18, marginVertical: 18, justifyContent: "center", alignItems: "center", borderRadius: 15 }}>
        <Image style={{ height: 80, width: 80, borderRadius: 50 }} source={require("./profiles/images/avt.jpg")} />
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Taylor Swift</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 17 }}>20017271</Text>
          <Entypo name="dot-single" size={24} color="black" />
          <Text style={{ fontSize: 17 }}>Phòng G202</Text>
        </View>
      </View>

      <View style={{ height: 180, width: "91%", marginHorizontal: 18, flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ height: 180, width: "65%", backgroundColor: "#ffffff" }}>
          <Text style={{ fontSize: 18 }}>Phòng 101</Text>
        </View>
        <View style={{ height: 180, width: "33%", backgroundColor: "#ffffff" }}>

        </View>
      </View>
    </View>

  )
}
