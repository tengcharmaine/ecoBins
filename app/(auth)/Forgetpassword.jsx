import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendEmail = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({email: email});
      if (error) {
        setError(error.message);
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      setError('Error sending email: ' + error.message);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    try {
      console.log('here');
      // Use the token as the OTP for password reset
      const { error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'email' });
      if (error) {
        setError(error.message);
      } 
    } catch (error) {
      setError('Error resetting password and logging in: ' + error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      

      {!isEmailSent ? (
        <>
        <View style= {styles.innerContainer}>
        <Text style={styles.title}>Forget Password</Text>
        <View style= {styles.emailContainer}>
            <Image
              source={require('./../../images/envelope-open.png')}
              style={styles.emailIcon}
            />
          {/* <Text style={styles.text1}>Enter your email</Text> */}
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
          {/* email err msg */}
          <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </>
      ) : (
        <>
        <View style= {styles.innerContainer1}>

        <Text style={styles.title1}>Enter OTP</Text>
          <Text style={styles.subtitle}>An 6 digit code has been sent to</Text>
          <Text style={styles.subtitle}>{email}</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="Enter OTP"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </>
      )}    
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  innerContainer1: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  logo: {
    height: '35%',
    width: '50%',
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    color: "black",
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginRight: 70,
      marginBottom: 15,
  },
  title1: {
    color: "black",
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginRight: 170,
      marginBottom: 15,
  },
  subtitle: {
    color: "black",
    fontSize: 16,
    textAlign: 'left',
    //marginBottom: 20,
  },
  input: {
    borderColor: "white",
    borderWidth: 1,
    borderBottomColor: "grey",
    backgroundColor: "white",
    width: 260,
    marginTop: 15,
  },
  button: {
    borderColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#c7dede",
    width: 320,
    height: 60,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 20,
    //overflow: 'hidden',
  },
  buttonText: {
    color: "black",
    fontWeight: 'bold',
    fontSize: 19,
    textAlign: 'center',
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
  errorText: {
    color: "red",
    marginTop: 10,
  },
  emailIcon: {
    width: 30,
    height: 30,
    //marginLeft: 10, // Adjust the margin as needed
    resizeMode: 'contain',
    marginRight: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
});

