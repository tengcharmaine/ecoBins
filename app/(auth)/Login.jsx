import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, ActivityIndicator, IconButton } from "react-native-paper";
import { Link, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);


  const navigation = useNavigation();

  const handleSubmit = async () => {
    setErrMsg('');
    setEmailErrMsg('');
    setPasswordErrMsg('');
    if (email === '' && password === '') {
      setEmailErrMsg("Email cannot be empty");
      setPasswordErrMsg("Password cannot be empty");
      return;
    } else if (password === '') {
      setPasswordErrMsg("Password cannot be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

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
  button: {
      borderColor: "black",
      alignItems: 'center',
      backgroundColor: "#c7dede",
      width: '25%',
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
      marginTop: '30%', 
      marginBottom: 30, 
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top: '30%',
    transform: [{ translateY: -12 }],
  },
});

  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
      setErrMsg('');
      setEmailErrMsg('');
      setPasswordErrMsg('');
    }, [])
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
    >
        <View style= {styles.innerContainer}>
            <Image source={require('./../../images/finalicon.jpeg')}
                   style={{height: '35%', width: '50%', borderRadius: 60, marginBottom: 20}}></Image>
            <Text style= {styles.text3}>Email</Text>
            <TextInput
                placeholder='Email'
                placeholderTextColor={"#dfd8dc"}
                style={styles.input}
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>}

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
            {passwordErrMsg !== "" && <Text style= {styles.error}>{passwordErrMsg}</Text>}

            <Button style = {styles.button} onPress={handleSubmit}>
                <Text style={styles.text1}> Login </Text>
            </Button>
            {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Button style = {styles.text2}>
                    <Text>First time user? Register here.</Text>
                </Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
                <Button style = {styles.text2}>
                    <Text>Forgot password? Click here.</Text>
                </Button>
            </TouchableOpacity>
        </View>    
    </KeyboardAwareScrollView>
  );
}
