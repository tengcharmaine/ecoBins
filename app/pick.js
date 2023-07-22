import React, {useState} from 'react';
import {Text, StyleSheet, View, TextInput, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Pick() {
  const [location, setLocation] = useState('Beside Terrace Canteen');

  return (
    <View style={{fontFamily: "Poppins"}}>
        <Picker
          selectedValue={location}
          onValueChange={currentLocation => setLocation(currentLocation)}>
          <Picker.Item label="Terrace" value="Beside Terrace Canteen"/>
          <Picker.Item label="CLB" value="Central Library" />
          <Picker.Item label="The Deck" value="The Deck canteen" />
          <Picker.Item label="Com 1" value="Com1 Level 2 study area" />
          <Picker.Item label="I3" value="I3 building" />
          <Picker.Item label="AS5" value="AS5 building" />
          <Picker.Item label="AS4" value="AS4 building" />
          <Picker.Item label="AS3" value="AS3 building" />
          <Picker.Item label="S17" value="S17 building" />
          <Picker.Item label="UHall" value="University Hall busstop" />
          <Picker.Item label="NUH" value="NUH near taxi pickup" />
          <Picker.Item label="Frontier" value="Frontier canteen" />
          <Picker.Item label="USC" value="Near Tea Party" />
          <Picker.Item label="FoS" value="Near OCBC ATM" />
        </Picker>
        <Text style={{fontFamily: "Poppins"}}>
          Selected: {location}
        </Text>
      </View>
  );
};