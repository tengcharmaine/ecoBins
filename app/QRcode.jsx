import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';

export default function QRCodeScreen() {
  const qrCodeValue = Math.random().toString(36).substring(2, 8);

  return (
    <View style={styles.container}>
      <QRCode value={qrCodeValue} size={300} />
      <Button style = {styles.button}>
            <Link style={styles.text1} href='/redemptionsuccess'>Confirm Redemption</Link>
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