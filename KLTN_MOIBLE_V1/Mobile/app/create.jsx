import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import React from 'react';
import ColorList from '../components/ColorList';

const Create = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BẠN ĐÃ ĐĂNG KÝ</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
    paddingBottom: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  highlight: {
    color: 'blue',
  },
});

export default Create;
