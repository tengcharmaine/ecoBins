import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';
import {supabase} from '../lib/supabase';
import {useRouter} from 'expo-router';

export default function QRCodeScreen() {
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
          .from('ranking')
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
    // const selectedMenuPoints = Object.values(buttonPressed).filter(
    //   (pressed, index) => pressed && index < 3
    // ).length * 20; // Assuming each menu has 20 points
    console.log(3);
    if (remainingPoints >= 20) {
      // Deduct points and proceed with redemption
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log(4);
        if (user) {
          console.log(user);
          const { data, error } = await supabase
            .from('ranking')
            .update({ score: remainingPoints - 20 })
            .eq('username', user.id)
            .single();
          if (error) {
            console.error('Error updating user points:', error.message);
            return;
          }
          console.log(user.score);
          setRemainingPoints(user.score);
          router.push('redemptionsuccess');
        }
      } catch (error) {
        console.error('Error updating user points:', error.message);
      }
    } else {
      alert('Insufficient points. Please select a different menu or earn more points.');
    }
  };
  
  return (
    <View style={styles.container}>
      <QRCode value={qrCodeValue} size={300} />
      <Button style={styles.button} onPress={handleConfirmation}>
        <Text style={styles.text1}>Confirm Redemption</Text>
      </Button>

      <Button style = {styles.button1}>
            <Link style={styles.text1} href='/rewards'>Cancel</Link>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    borderColor: "black",
    alignItems: 'center',
    backgroundColor: "#c7dede",
    width: '40%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    
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
    //marginTop: 20,
    //textAlign: 'left',
    marginLeft: 5,
    //justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1,
    //width: 1
    //marginRight: 230,
    //marginBottom: 5,
  },
});