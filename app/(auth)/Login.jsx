import { StyleSheet, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import * as Google from "expo-auth-session/providers/google";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');

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

  // const [req, _res, promptAsync] = Google.useAuthRequest({
  //   expoClientId: '',
  //   iosClientId: '',
  //   androidClientId: ''
  // })

  // const handleGoogleSignIn = async () => {
  //   promptAsync({
  //       url: `https://modwjtelabjhmmhchteg.supabase.co/auth/v1/authorize?provider=google`,

  //   }).then(async (res) => {
  //       // After we got refresh token with the response, we can send it to supabase to sign-in the user
  //       const { user, session, error } = await supabase.auth.signIn({
  //           refreshToken: res.params.refresh_token,
  //       });
  //       console.log({ user, session, error });
  //   });
    // try {
    //     setLoading(true);
    //     console.log(1);
    //     const { data, error } = await supabase.auth.signInWithOAuth({
    //         provider: 'google',
    //     });
    //     console.log(2);
    //     if (error) {
    //         setErrMsg(error.message);
    //         return;
    //     }

    //     navigation.navigate('Login');
    // } catch (error) {
    //     setErrMsg("An error occurred during Google Sign-In.");
    //     console.log(error);
    // } finally {
    //     setLoading(false);
    // }
// };

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
  }
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
            <TextInput
                secureTextEntry
                style={styles.input}
                placeholder='Password'
                placeholderTextColor={"#dfd8dc"}
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
            {passwordErrMsg !== "" && <Text style= {styles.error}>{passwordErrMsg}</Text>}

            <Button style = {styles.button} onPress={handleSubmit}>
                <Text style={styles.text1}> Login </Text>
            </Button>
            {/* <Button style={styles.text2} onPress={handleGoogleSignIn}>
                <Text style={styles.text1}>Sign in with Google</Text>
            </Button>   */}
            {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/Register">
                <Button style = {styles.text2}>
                    <Text>First time user? Register here.</Text>
                </Button>
            </Link>
        </View>    
    </KeyboardAwareScrollView>
  );
}
