import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <View style={styles.container}>
      <FlatList
        data={members}
        style={{ width: '100%' }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={styles.memberContainer}>
              <Text style={styles.member}>{item.name}</Text>
              {selectedMember === item && (
                <Text style={styles.details}>{item.details}</Text>
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
  memberContainer: {
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
  member: {
    fontSize: 18,
    color: '#333',
  },
  details: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});

export default Explore;
