import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image  } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton} from 'react-native-paper';
import { supabase } from "../lib/supabase";
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {useRouter} from 'expo-router';



import * as ExpoLinking from 'expo-linking'; // Import ExpoLinking from the 'expo-linking' package
import { useURL } from 'expo-linking'; // Import the useURL hook from 'expo-linking'
import * as Linking from 'expo-linking';


export default function PasswordUpdate() {
  const route = useRoute();
  const navigation = useNavigation();
  const router = useRouter();


  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
  });

  //const { userId, token } = route.params;
  //console.log(userId);
  console.log(route.params);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleReturn = () => {
    navigation.goBack();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const handlePasswordUpdate = async () => {
    setErrMsg("");

    if (password === "") {
      setErrMsg("Password cannot be empty");
      return;
    }

    //const { data: { user }, error: userError } = await supabase.auth.getUser()
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    setLoading(false);

    if (error) {
      setErrMsg(error.message);
      return;
    }

    navigation.navigate("passwordUpdateSuccess");
  };

  const goBack = () => {
    navigation.navigate('settings');
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "white",

    },
    input: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    title: {
      color: "black",
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginRight: 40,
      marginBottom: 15,
      fontFamily: 'PoppinsBold',
  },
    button: {
      borderColor: "black",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#c7dede",
      width: '85%',
      height: 60,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 20,
        
    },
    text1: {
      color: "black",
      fontWeight: 'bold',
      fontSize: 19,
      textAlign: 'center',
      fontFamily: 'PoppinsSemiBold',
    },
  
    text2: {
        color: "black",
        textAlign: "left",
    },
  
    text3: {
        color: "black",
        marginTop: 20,
        textAlign: 'left',
        marginRight: 255,
        marginBottom: 5,
    },
    passwordInput: {
      borderColor: "white",
      borderWidth: 1,
      borderBottomColor: "grey",
      backgroundColor: "white",
      width: '75%',
    },
  
    error: {
        color: "red",
        marginTop: 4,
        marginBottom: 5,
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '80%', 
        marginBottom: 30, 
    },
    passwordIcon: {
      position: 'absolute',
      right: 10,
      top: '30%',
      transform: [{ translateY: -12 }],
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 1,
  },
    emailIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      marginRight: 20,
    },
    error: {
      color: "red",
      fontFamily: 'Poppins',
      //marginTop: 10,
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
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
    <TouchableOpacity onPress={goBack} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
    <View style= {styles.innerContainer}>
    <Text style= {styles.title}> Reset password </Text>
      {/* <Text style= {styles.text1}>Password</Text> */}
            <View style={styles.input}>
            <Image
            source={require('./../images/lock.png')}
            style={styles.emailIcon}
          />
                <TextInput
                    secureTextEntry={!passwordVisible}
                    placeholder="Password"
                    placeholderTextColor={"#dfd8dc"}
                    style={styles.passwordInput}
                    autoCapitalize='none'
                    textContentType='password'
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.passwordIcon}
                    onPress={togglePasswordVisibility}
                >
                <IconButton
                    icon={passwordVisible ? "eye-off" : "eye"}
                    color="#000"
                    size={20}
                />
                </TouchableOpacity>
            </View>
            {errMsg !== "" && <Text style = {styles.error}>{errMsg}</Text>}

            <TouchableOpacity style = {styles.button} onPress={handlePasswordUpdate}>
                <Text style={styles.text1}> Update password </Text>
            </TouchableOpacity>
      {loading && <ActivityIndicator />}
    </View>
    </KeyboardAwareScrollView>
  );
}