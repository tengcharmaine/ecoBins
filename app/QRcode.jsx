import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';
import {supabase} from '../lib/supabase';
import {useRouter} from 'expo-router';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


export default function QRCodeScreen() {

  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),

  });

  const navigation = useNavigation();
  const [remainingPoints, setRemainingPoints] = useState(0);
  const router = useRouter();
  useEffect(() => {
    // Fetch the user's score or remaining points from Supabase or any other data source
    const fetchRemainingPoints = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        console.log(user);
        if (user) {
          const { data, error } = await supabase
          .from('redemption')
          .select('score')
          .eq('username', user.id); 
          console.log(2);
          if (error) {
            console.error('Error fetching user points1:', error.message);
            return;
          }

          if (data.length > 0) {
            const userScore = data[0].score;
            setRemainingPoints(userScore);
            console.log(userScore);
          } else {
            // Handle the case when there are no matching records
            console.log('No data found for the user');
          }
        } else {
          console.log('not auth');
        }
      } catch (error) {
        console.error('Error fetching user points2:', error.message);
      }
    };

    fetchRemainingPoints();
  }, []); // Run this effect only once, on component mount
  
  const qrCodeValue = Math.random().toString(36).substring(2, 8);
  const handleConfirmation = async () => {
    console.log(3);
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log(4);
        if (user) {
          console.log(user);
          const { data, error } = await supabase
            .from('redemption')
            .update({ score: remainingPoints - 20 })
            .eq('username', user.id)
            .single();
          if (error) {
            console.error('Error updating user points:', error.message);
            return;
          }
          setRemainingPoints(user.score);
          console.log(user.score);
          router.push('redemptionsuccess');
        }
      } catch (error) {
        console.error('Error updating user points:', error.message);
      }
  };

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <QRCode value={qrCodeValue} size={300} />
      <TouchableOpacity style={styles.button} onPress={handleConfirmation}>
        <Text style={styles.text1}>Confirm Redemption</Text>
      </TouchableOpacity>
    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  button: {
    borderColor: "black",
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: "#c7dede",
    width: '85%',
    height: 60,
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 20,
    
    // borderColor: "black",
    // alignSelf: 'center',
    // backgroundColor: "#c7dede",
    // width: '47%',
    // marginTop: 20,
    // borderRadius: 10,
  },

  button1: {
    borderColor: "black",
    alignItems: 'center',
    backgroundColor: "#c7dede",
    width: '20%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
  },

  text1: {
    color: "black",
    fontWeight: 'bold',
    fontSize: 19,
    textAlign: 'center',
    fontFamily: 'PoppinsSemiBold',
  },
});