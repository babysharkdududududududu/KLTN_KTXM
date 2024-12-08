import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const Explore = () => {
  const members = [
    { name: "John Doe", details: "Tuổi: 20, Ngành: CNTT" },
    { name: "Emily Davis", details: "Tuổi: 21, Ngành: Kinh tế" },
    { name: "Võ Văn Kiên", details: "Tuổi: 22, Ngành: Xây dựng" },
    { name: "Đặng Thị Xuân", details: "Tuổi: 19, Ngành: Thiết kế" },
  ];

  const [selectedMember, setSelectedMember] = useState(null);

  const handlePress = (member) => {
    setSelectedMember(selectedMember === member ? null : member);
  };

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
