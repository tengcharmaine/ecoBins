import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function VideoScreen() {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.navigate('settings');
    };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Tutorial video</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

      <Video
        source={require('../videos/milestone2.mp4')}
        shouldPlay={true}
        isMuted={false}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        useNativeControls
      />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
      },
      video: {
        width: 350,
        height: 300,
      },
});