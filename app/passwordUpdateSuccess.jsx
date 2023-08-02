import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from 'expo-font';


export default function PasswordUpdateSuccess() {
    const navigation = useNavigation();
    const [loaded] = useFonts({
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
        PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
        PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
    });

    // Navigate to the "settings" screen after successful password update
    const handleReturn = () => {
      navigation.navigate("settings");
    };
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      },
      title: {
        color: "black",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'PoppinsBold',
        marginTop: 40,

      },
      successText: {
        color: "black",
        fontSize: 19,
        marginBottom: 30,
        fontFamily: 'Poppins',

      },
      button: {
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#c7dede",
        width: "85%",
        height: 60,
        marginBottom: 10,
        borderRadius: 20,
      },
      buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 19,
      },
      backButton: {
        position: "absolute",
        top: 60,
        left: 20,
        zIndex: 1,
      },
    });

    if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleReturn} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={{uri: "https://media.giphy.com/media/EtzayAGfqhCbEs62iV/giphy.gif" }}
                   style={{height: '20%', width: '75%', borderRadius: 40, alignSelf: 'center', }}></Image>        
        <Text style={styles.title}>Password Updated {'\n'} Successfully!</Text>
        <Text style={styles.successText}>Your password has been updated.</Text>
      </View>
    );
  }
  
