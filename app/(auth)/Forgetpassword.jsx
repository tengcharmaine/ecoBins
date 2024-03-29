import React, { useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Method to load fonts used
  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
    Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Method to send the email with OTP to user
  const handleSendEmail = async () => {
    setEmailErrMsg('');
    setError(null);
    
    try {
      // error catching: leaving email input empty
      if (email === '' ) {
            setEmailErrMsg("Email cannot be empty");
            return;
          } 

      setLoading(true);
      // send email with OTP designed in Supabase
      const { error } = await supabase.auth.signInWithOtp({email: email});
      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        setIsEmailSent(true);
      }
    } catch (error) {
      setError('Error sending email: ' + error.message);
    }
  };

  // Method to verify OTP keyed in
  const handleVerifyOTP = async () => {
    setError(null);
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'email' });
      setLoading(false);

      if (error) {
        setError(error.message);
      } 
    } catch (error) {
      setError('Error resetting password and logging in: ' + error.message);
    }
  };
  
  // Navigation for back arrow
  const handleGoBack = () => {
    navigation.navigate('Login');
  };

  // To make sure that fonts are completely loaded in
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {!isEmailSent ? (
        <>

        {/* Forget password screen */}

        {/* back arrow */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* main components of screen */}
        <View style= {styles.innerContainer}>
        <Text style={styles.title}>Forget Password</Text>
        <View style= {styles.emailContainer}>
            <Image
              source={require('./../../images/envelope-open.png')}
              style={styles.emailIcon}
            />
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {emailErrMsg !== "" && <Text style= {styles.errorText}>{emailErrMsg}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {loading && <ActivityIndicator />}
          </View>
        </>
      ) : (
        <>

        {/* Verify OTP screen */}

        {/* back button */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton1}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* main component of screen */}
        <View style= {styles.innerContainer1}>
        <Text style={styles.title1}>Enter OTP</Text>
        <Text style={styles.subtitle}>An 6 digit code has been sent to</Text>
        <Text style={styles.subtitle}>{email}</Text>
        <View style= {styles.emailContainer}>
          <Image
              source={require('./../../images/otp.png')}
              style={styles.otpIcon}
            />
          
          <TextInput
            autoCapitalize="none"
            placeholder="Enter OTP"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
          />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          {loading && <ActivityIndicator />}
        </>
      )}    
    </View>
  );
}

// custom stylesheet
const styles = StyleSheet.create({
  backButton: {
    position: 'left',
    top: -220,
    left: 16,
    zIndex: 1,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'left'
  },
  backButton1: {
    position: 'left',
    top: -200,
    left: 16,
    zIndex: 1,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'left'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerContainer1: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
      marginRight: 50,
      // marginBottom: 15,
      fontFamily: "Poppins_Bold"
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
      fontFamily: "Poppins_Bold"
  },
  subtitle: {
    color: "black",
    fontSize: 16,
    alignItems: 'flex-start',
    textAlign: 'left',
    fontFamily: "Poppins"
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
    alignSelf: 'center',
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
    fontFamily: "Poppins_SemiBold"
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
    fontFamily: "Poppins"
  },
  emailIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 20,
  },
  otpIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginRight: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
});

