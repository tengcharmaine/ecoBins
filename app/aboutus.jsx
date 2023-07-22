import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function AboutUsScreen() {
    const navigation = useNavigation();

    const [loaded] = useFonts({
      Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
      Poppins_Bold: require('../assets/fonts/Poppins-Bold.ttf'),
      Poppins_SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const handleGoBack = () => {
        navigation.navigate('settings');
      };

      if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }

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
        We want to encourage users to incorporate recycling into their lifestyle, especially in the NUS campus.
      </Text>
      <Text style={styles.description}>
        If you have any questions, feedback, or suggestions, please don't hesitate to contact us on telegram. 
      </Text>
      <Text style={styles.contactInfo}>
        Contact Information:
        </Text>
        <Text style={styles.tele}>
        Song Jia Hui (@songjiahui)
        {'\n'}
        Teng Shi Rou Charmaine (@charmteng)
        </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tele: {
    fontFamily: "Poppins",
    fontSize: 16,
    textAlign: 'center', 
  },
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
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: "Poppins_Bold"
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: "Poppins"
  },
  contactInfo: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center', 
    fontFamily: "Poppins_SemiBold"
  },
});