import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AboutUsScreen() {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.navigate('settings');
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={require('./../images/finalicon.jpeg')}
                   style={{height: '20%', width: '50%', borderRadius: 60, marginBottom: 20}}></Image>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.description}>
        Welcome to ecoBins! 
        {'\n'}
        {'\n'}
        Our app aims to encourage users to incorporate recycling into their lifestyle, especially in the NUS campus.
      </Text>
      <Text style={styles.description}>
        If you have any questions, feedback, or suggestions, please don't hesitate to contact us. 
      </Text>
      <Text style={styles.contactInfo}>
        Contact Information:
        {'\n'}
        Song Jia Hui (@songjiahui)
        {'\n'}
        Teng Shi Rou Charmaine (@charmteng)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  },
});