import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


export default function VideoScreen() {
  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
  });
    const navigation = useNavigation();

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
    <View style={styles.container}>
        <Text style={styles.title}>Tutorial video</Text>
        <Text style={styles.text}>Do switch off your silent mode {'\n'} to enjoy the full experience of this feature!</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

      <Video
        source={require('../videos/ms33.mp4')}
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
      color: "black",
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginBottom: 10,
      fontFamily: 'PoppinsBold',
      },
      text: {
        color: "black",
        marginTop: 5,
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Poppins',
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