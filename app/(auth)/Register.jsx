// import { useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { StyleSheet, View, Alert, TouchableOpacity, Image } from "react-native";
// import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { Ionicons } from '@expo/vector-icons';

// export default function Register() {
//     const navigation = useNavigation();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [errMsg, setErrMsg] = useState('');
//     const [emailErrMsg, setEmailErrMsg] = useState('');
//     const [passwordErrMsg, setPasswordErrMsg] = useState('');
//     const [showEmailCheck, setShowEmailCheck] = useState(false);
//     const [passwordVisible, setPasswordVisible] = useState(false);


//     const handleSubmit = async () => {
//         setErrMsg('');
//         setEmailErrMsg('');
//         if (email === '' && password === '') {
//             setEmailErrMsg("Email cannot be empty");
//             setPasswordErrMsg("Password cannot be empty");
//             return;
//           } else if (password === '') {
//             setPasswordErrMsg("Password cannot be empty");
//             return;
//           } else if (!isPasswordValid(password)) {
//             setPasswordErrMsg('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
//             return;
//         }
//         setLoading(true);
//         const { data, error } = await supabase.auth.signUp({ email, password });
//         setLoading(false);
//         if (error) {
//             setErrMsg(error.message);
//             return;
//         }  else if (data.user?.identities?.length === 0) {
//             setErrMsg('User has already registered');
//             return;
//         } 

//         console.log(email)

//         setShowEmailCheck(true); // Show the "Check your email" message

//         navigation.navigate('Login');
//     }

//     const showVerificationAlert = () => {
//         Alert.alert(
//             'Email Verification',
//             'Please check your email for the verification link.',
//             [
//                 { text: 'OK' },
//             ]
//         );
//     };

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!passwordVisible);
//     }

//     const isPasswordValid = (password) => {
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
//         const minLength = 8;
    
//         return password.length >= minLength && passwordRegex.test(password);
//     };

//     const handleGoBack = () => {
//         navigation.navigate('Login');
//     }

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1, 
//             justifyContent: 'center', 
//         },
//         innerContainer: {
//             justifyContent: 'center',
//             alignItems: 'center',
//             marginTop: '10%', 
//             marginBottom: 30, 
//         },
//         input: {
//             borderColor: "white",
//             borderWidth: 1,
//             borderBottomColor: "grey",
//             backgroundColor: "white",
//             width: '75%',
//         },
//         passwordInput: {
//             backgroundColor: "white",
//             borderRadius: 5
//         },
//         button: {
//             borderColor: "black",
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: "#c7dede",
//             width: '85%',
//             height: 60,
//             marginTop: 20,
//             marginBottom: 10,
//             borderRadius: 20,
            
//         },
//         text1: {
//             color: "black",
//             fontWeight: 'bold',
//             fontSize: 19,
//             textAlign: 'center',
//         },

//         text2: {
//             color: "black",
//             marginTop: 20,
//             textAlign: 'left',
//             marginRight: 230,
//             marginBottom: 5,
//         },

//         title: {
//             color: "black",
//             marginTop: 20,
//             justifyContent: 'center',
//             fontWeight: 'bold',
//             fontSize: 34,
//             textAlign: 'left',
//             marginRight: 160,
//             marginBottom: 15,
//         },
//         error: {
//             color: "red",
//             marginTop: 4,
//             marginBottom: 5,
//             textAlign: 'center'
//         },
//         passwordIcon: {
//             position: 'absolute',
//             right: 10,
//             top: '30%',
//             transform: [{ translateY: -12 }],
//           },
//           emailIcon: {
//             width: 30,
//             height: 30,
//             //marginLeft: 10, // Adjust the margin as needed
//             resizeMode: 'contain',
//             marginRight: 20,
//           },
//           emailContainer: {
//             flexDirection: 'row',
//             alignItems: 'flex-end',
//             marginBottom: 20,
//           },
//           backButton: {
//             position: 'absolute',
//             top: 50,
//             left: 16,
//             zIndex: 1,
//             padding: 10,
//             borderRadius: 10,
//           },
//     });

//     return (
//         <KeyboardAwareScrollView
//               contentContainerStyle={styles.container}
//               resetScrollToCoords={{ x: 0, y: 0 }}
//               scrollEnabled={true}>
//                 <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color="black" />
//                 </TouchableOpacity>
//                 <View style={styles.innerContainer}>
//                     <Text style= {styles.title}> Registration </Text>
//                     <View style= {styles.emailContainer}>
//                         <Image
//                             source={require('./../../images/envelope-open.png')}
//                             style={styles.emailIcon}
//                         />
//                     {/* <Text style= {styles.text1}>Email</Text> */}
//                     <TextInput
//                         autoCapitalize='none'
//                         placeholder="Email"
//                         placeholderTextColor={"#dfd8dc"}
//                         style={styles.input}
//                         textContentType='emailAddress'
//                         value={email}
//                         onChangeText={setEmail} />
//                     </View>
//                     {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>}
        
//                     <View style={styles.emailContainer}>
//                         <Image
//                             source={require('./../../images/lock.png')}
//                             style={styles.emailIcon}
//                         />
//                     {/* <Text style= {styles.text2}>Password</Text> */}
//                     {/* <View style={styles.input}> */}
//                         <TextInput
//                             secureTextEntry={!passwordVisible}
//                             placeholder="Password"
//                             placeholderTextColor={"#dfd8dc"}
//                             style={styles.input}
//                             autoCapitalize='none'
//                             textContentType='password'
//                             value={password}
//                             onChangeText={setPassword}
//                         />
//                         <TouchableOpacity
//                             style={styles.passwordIcon}
//                             onPress={togglePasswordVisibility}
//                         >
//                         <IconButton
//                             icon={passwordVisible ? "eye-off" : "eye"}
//                             color="#000"
//                             size={23}
//                         />
//                         </TouchableOpacity>
//                     {/* </View> */}
//                     </View>
//                     {passwordErrMsg !== "" && <Text style= {styles.error}>{passwordErrMsg}</Text>}
        
//                     <TouchableOpacity style = {styles.button} onPress={handleSubmit}>
//                         <Text style={styles.text1}> Continue </Text>
//                     </TouchableOpacity>          
//                     {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
//                     {loading && <ActivityIndicator />}
//                     {showEmailCheck && showVerificationAlert()}
//                 </View>
//             </KeyboardAwareScrollView>
//             );
// }

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Alert, TouchableOpacity, Image } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirmation password
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [cfmpasswordErrMsg, setcfmPasswordErrMsg] = useState('');
  const [showEmailCheck, setShowEmailCheck] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cfmpasswordVisible, setcfmPasswordVisible] = useState(false);

  const handleSubmit = async () => {
    setErrMsg('');
    setEmailErrMsg('');
    setPasswordErrMsg('');
    setcfmPasswordErrMsg('');
    setcfmPasswordErrMsg('');

    if (email === '' && password === '') {
      setEmailErrMsg("Email cannot be empty");
      setPasswordErrMsg("Password cannot be empty");
      return;
    } else if (email === '' && password !== '') {
      setEmailErrMsg("Email cannot be empty");
    } else if (password === '') {
      setPasswordErrMsg("Password cannot be empty");
      return;
    } else if (!isPasswordValid(password)) {
      setPasswordErrMsg('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setcfmPasswordErrMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrMsg(error.message);
      return;
    } else if (data.user?.identities?.length === 0) {
      setErrMsg('User has already registered');
      return;
    }

    setShowEmailCheck(true); // Show the "Check your email" message

    navigation.navigate('Login');
  }

  const showVerificationAlert = () => {
    Alert.alert(
      'Email Verification',
      'Please check your email for the verification link.',
      [{ text: 'OK' }],
    );
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const togglecfmPasswordVisibility = () => {
    setcfmPasswordVisible(!cfmpasswordVisible);
  }

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    const minLength = 8;

    return password.length >= minLength && passwordRegex.test(password);
  };

  const handleGoBack = () => {
    navigation.navigate('Login');
  }

  const styles = StyleSheet.create({
            container: {
                flex: 1, 
                justifyContent: 'center', 
            },
            innerContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10%', 
                marginBottom: 30, 
            },
            input: {
                borderColor: "white",
                borderWidth: 1,
                borderBottomColor: "grey",
                backgroundColor: "white",
                width: '75%',
                //height: 40,
            },
            passwordInput: {
                backgroundColor: "white",
                borderRadius: 5
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
            },
    
            text2: {
                color: "black",
                marginTop: 20,
                textAlign: 'left',
                marginRight: 230,
                marginBottom: 5,
            },
    
            title: {
                color: "black",
                marginTop: 20,
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 34,
                textAlign: 'left',
                marginRight: 160,
                marginBottom: 15,
            },
            error: {
                color: "red",
                textAlign: 'center'
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
              backButton: {
                position: 'absolute',
                top: 50,
                left: 16,
                zIndex: 1,
                padding: 10,
                borderRadius: 10,
              },
        });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <Text style={styles.title}> Registration </Text>
        <View style={styles.emailContainer}>
          <Image
            source={require('./../../images/envelope-open.png')}
            style={styles.emailIcon}
          />
          <TextInput
            autoCapitalize='none'
            placeholder="Email"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            textContentType='emailAddress'
            value={email}
            onChangeText={setEmail} />
        </View>
        {emailErrMsg !== "" && <Text style={styles.error}>{emailErrMsg}</Text>}

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
            onChangeText={(text) => {
              setPassword(text);
              setPasswordErrMsg(''); // Clear the password error message
              setConfirmPassword(''); // Clear the confirmation password field
            }}
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
        {passwordErrMsg !== "" && <Text style={styles.error}>{passwordErrMsg}</Text>}

        {/* Confirmation password input */}
        <View style={styles.emailContainer}>
          <Image
            source={require('./../../images/lock.png')}
            style={styles.emailIcon}
          />
          <TextInput
            secureTextEntry={!cfmpasswordVisible}
            placeholder="Confirm Password"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            autoCapitalize='none'
            textContentType='password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={togglecfmPasswordVisibility}
          >
            <IconButton
              icon={cfmpasswordVisible ? "eye-off" : "eye"}
              color="#000"
              size={23}
            />
          </TouchableOpacity>
        </View>
        {cfmpasswordErrMsg !== "" && <Text style={styles.error}>{cfmpasswordErrMsg}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.text1}> Continue </Text>
        </TouchableOpacity>
        {errMsg !== "" && <Text style={styles.error}>{errMsg}</Text>}
        {loading && <ActivityIndicator />}
        {showEmailCheck && showVerificationAlert()}
      </View>
    </KeyboardAwareScrollView>
  );
}
