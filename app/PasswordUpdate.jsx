import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { supabase } from "../lib/supabase";
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as ExpoLinking from 'expo-linking'; // Import ExpoLinking from the 'expo-linking' package
import { useURL } from 'expo-linking'; // Import the useURL hook from 'expo-linking'
import * as Linking from 'expo-linking';


export default function PasswordUpdate() {
  const route = useRoute();
  const navigation = useNavigation();


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
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    input: {
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: "white",
        width: '75%',
        borderRadius: 5
    },
    title: {
      color: "black",
      fontSize: 20,
      marginBottom: 20, 
      fontWeight: "bold",
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
    text1: {
        color: "black",
        marginTop: 20,
        textAlign: 'left',
        marginRight: 230,
        marginBottom: 5,
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
      backgroundColor: "white",
      borderRadius: 5
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
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
    <View style= {styles.innerContainer}>
    <Text style= {styles.title}> Reset password </Text>
      <Text style= {styles.text1}>Password</Text>
            <View style={styles.input}>
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
            <Button style = {styles.button} onPress={handlePasswordUpdate}>
                <Text style={styles.text1}> Update password </Text>
            </Button>
            <Button style={styles.button} onPress={handleReturn}>
              <Text style={styles.text1}> Back </Text>
            </Button>
      {errMsg !== "" && <Text>{errMsg}</Text>}
      {loading && <ActivityIndicator />}
    </View>
    </KeyboardAwareScrollView>
  );
}
