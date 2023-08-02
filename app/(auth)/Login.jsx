
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, ActivityIndicator, IconButton } from "react-native-paper";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import { supabase } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFonts } from 'expo-font';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  // method to load fonts used
  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
    Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // method to login users into their account
  const handleSubmit = async () => {
    setErrMsg('');
    setEmailErrMsg('');
    setPasswordErrMsg('');

    // error handling: email and password input left empty
    if (email === '' && password === '') {
      setEmailErrMsg("Email cannot be empty");
      setPasswordErrMsg("Password cannot be empty");
      return;
    } else if (password === '') {
      setPasswordErrMsg("Password cannot be empty");
      return;
    }
    setLoading(true);
    // sign in users with Supabase auth
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };


  // method to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  // navigation to forget password screen
  const handleForgetPassword = () => {
    navigation.navigate('Forget Password');
  };

  // navigation to register screen
  const handleRegister = () => {
    navigation.navigate('Register');
  };


  // custom stylesheet
  const styles = StyleSheet.create({
  container: {
      flex: 1, 
  },
  input: {
      borderColor: "white",
      borderWidth: 1,
      borderBottomColor: "grey",
      backgroundColor: "white",
      width: '75%',
      fontFamily: "Poppins"
      //borderRadius: 5
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
      fontFamily: "Poppins_SemiBold"
  },

  text2: {
      color: "black",
      textAlign: "center",
      fontSize: 16,
      marginTop: 10,
      fontFamily: "Poppins"
  },
  text22: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Poppins"
},


  text3: {
      color: "black",
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginRight: 255,
      marginBottom: 15,
      fontFamily: "Poppins_Bold"
  },
  passwordInput: {
    backgroundColor: "white",
    borderRadius: 5
  },

  error: {
      color: "red",
      marginTop: 4,
      marginBottom: 5,
      fontFamily: "Poppins"
  },
  innerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: '20%', 
      marginBottom: 30, 
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top: '30%',
    transform: [{ translateY: -12 }],
  },
  emailIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  }
});

  // method to refresh screen
  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
      setErrMsg('');
      setEmailErrMsg('');
      setPasswordErrMsg('');
    }, [])
  );

  // To make sure that fonts are completely loaded in
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  
  return (
    // make screen scrollable

    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >

      
      {/* main component of screen */}
        <View style= {styles.innerContainer}>
            <Image source={require('./../../images/finalicon.jpeg')}
                   style={{height: '35%', width: '60%', borderRadius: 60, marginBottom: 20}}></Image>
            <Text style= {styles.text3}>Login</Text>
            <View style= {styles.emailContainer}>
              <Image
                source={require('./../../images/envelope-open.png')}
                style={styles.emailIcon}
              />
              <TextInput
                  placeholder='Email'
                  placeholderTextColor={"#dfd8dc"}
                  style={styles.input}
                  autoCapitalize='none'
                  textContentType='emailAddress'
                  value={email}
                  onChangeText={setEmail} />
            </View>
            {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>}
            
            <View style={styles.passwordContainer}>
            <View style={styles.errorContainer}>
            <View style={styles.emailContainer}>
              <Image
                source={require('./../../images/lock.png')}
                style={styles.emailIcon}
              />
                <TextInput
                    secureTextEntry={!passwordVisible}
                    placeholder="Password"
                    placeholderTextColor={"#dfd8dc"}
                    style={styles.input}
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
                    size={23}
                />
                </TouchableOpacity>
            </View>
            {passwordErrMsg !== "" && <Text style= {styles.error}>{passwordErrMsg}</Text>}
            </View>
            <TouchableOpacity onPress={handleForgetPassword}>
              <Text style = {styles.text22}>Forget Password?</Text>
            </TouchableOpacity>
            </View>
            <TouchableOpacity style = {styles.button} onPress={handleSubmit}>
                <Text style={styles.text1}> Login </Text>
            </TouchableOpacity>
            {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <TouchableOpacity onPress={handleRegister}>
                <Text style = {styles.text2}>First time user? Register here.</Text>
            </TouchableOpacity>
            
        </View>    
    </KeyboardAwareScrollView>
  );
}
