import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { Link } from 'expo-router';

export default function QRCodeScreen() {
  const qrCodeValue = Math.random().toString(36).substring(2, 8);

  return (
    <View style={styles.container}>
      <QRCode value={qrCodeValue} size={200} />
      <Button style = {styles.button}>
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
    //justifyContent: 'center',
    backgroundColor: "#c7dede",
    width: '25%',
    marginTop: 20,
    marginBottom: 10,
    //marginRight: 200,
    borderRadius: 10,
  },

  text1: {
    color: "black",
    marginTop: 20,
    textAlign: 'left',
    marginRight: 230,
    marginBottom: 5,
  },
});