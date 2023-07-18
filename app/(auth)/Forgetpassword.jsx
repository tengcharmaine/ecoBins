// // import React, { useState } from "react";
// // import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
// // import { Text, Button, TextInput } from "react-native-paper";
// // import { useNavigation } from '@react-navigation/native';
// // import { supabase } from "../../lib/supabase";

// // export default function ForgetPasswordScreen() {
// //   const [email, setEmail] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [isEmailSent, setIsEmailSent] = useState(false);
// //   const navigation = useNavigation();

// //   const handleSendEmail = async () => {
// //     const { error } = await supabase.auth.api.resetPasswordForEmail(email);
// //     if (error) {
// //       setError(error.message);
// //     } else {
// //       setIsEmailSent(true);
// //     }
// //   };

// //   const handleVerifyOTP = async () => {
// //     const { error } = await supabase.auth.api.verifyOTP(email, otp);
// //     if (error) {
// //       setError(error.message);
// //     } else {
// //       // OTP verification successful, navigate back to the Login page.
// //       navigation.navigate('LoginPage');
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Forget Password</Text>

// //       {!isEmailSent ? (
// //         <>
// //           <Text style={styles.text1}>Enter your email</Text>
// //           <TextInput
// //             autoCapitalize="none"
// //             placeholder="Email"
// //             placeholderTextColor={"#dfd8dc"}
// //             style={styles.input}
// //             value={email}
// //             onChangeText={setEmail}
// //           />
// //           <Button style={styles.text2} onPress={handleSendEmail}>
// //             <Text>Send Email</Text>
// //           </Button>
// //         </>
// //       ) : (
// //         <>
// //           <Text style={styles.subtitle}>Email sent! Check your inbox for the OTP:</Text>
// //           <TextInput
// //             autoCapitalize="none"
// //             placeholder="Enter OTP"
// //             placeholderTextColor={"#dfd8dc"}
// //             style={styles.input}
// //             value={otp}
// //             onChangeText={setOtp}
// //           />
// //           <Button style={styles.button} onPress={handleVerifyOTP}>
// //             <Text style={styles.buttonText}>Verify OTP</Text>
// //           </Button>
// //         </>
// //       )}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     top: 60,
// //     left: 20,
// //     zIndex: 1,
// //   },
// //   logo: {
// //     height: '35%',
// //     width: '50%',
// //     borderRadius: 60,
// //     marginBottom: 20,
// //   },
// //   title: {
// //     color: "black",
// //     fontSize: 24,
// //     marginBottom: 20,
// //     fontWeight: "bold",
// //   },
// //   subtitle: {
// //     color: "black",
// //     fontSize: 18,
// //     marginBottom: 20,
// //   },
// //   input: {
// //     borderColor: "black",
// //     borderWidth: 1,
// //     backgroundColor: "white",
// //     width: "100%",
// //     borderRadius: 5,
// //     marginBottom: 20,
// //     paddingHorizontal: 10,
// //   },
// //   button: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#c7dede",
// //     width: "100%",
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //   },
// //   buttonText: {
// //     color: "black",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   text1: {
// //     color: "black",
// //     marginTop: 20,
// //     textAlign: 'left',
// //     marginRight: 230,
// //     marginBottom: 5,
// // },
// // text2: {
// //     color: "black",
// //     textAlign: "left",
// // },
// // });
// import React, { useState } from "react";
// import { StyleSheet, View, TouchableOpacity } from "react-native";
// import { Text, Button, TextInput } from "react-native-paper";
// import { useNavigation } from '@react-navigation/native';
// import { supabase } from "../../lib/supabase";

// export default function ForgetPasswordScreen() {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [isEmailSent, setIsEmailSent] = useState(false);
//   const [error, setError] = useState(null);
//   const navigation = useNavigation();

//   const handleSendEmail = async () => {
//     setError(null);
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email);
//       if (error) {
//         setError(error.message);
//       } else {
//         setIsEmailSent(true);
//       }
//     } catch (error) {
//       setError('Error sending email: ' + error.message);
//     }
//   };

// //   const handleVerifyOTP = async () => {
// //     setError(null);
// //     try {
// //       const { error } = await supabase.auth.verifyOTP(email, otp);
// //       if (error) {
// //         setError(error.message);
// //       } else {
// //         navigation.navigate('LoginPage');
// //       }
// //     } catch (error) {
// //       setError('Error verifying OTP: ' + error.message);
// //     }
// //   };

// const handleVerifyOTP = async () => {
//     setError(null);
//     try {
//       // Use the token as the OTP for password reset
//       const { error } = await supabase.auth.updateUser({ password: otp }, { accessToken: otp });
//       if (error) {
//         setError(error.message);
//       } else {
//         // OTP verification and password reset successful, log the user in
//         const { user, session, error: loginError } = await supabase.auth.signIn({ email, password: otp });
//         if (loginError) {
//           setError(loginError.message);
//         } else {
//           // User logged in successfully
//           navigation.navigate('index'); 
//         }
//       }
//     } catch (error) {
//       setError('Error resetting password and logging in: ' + error.message);
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forget Password</Text>

//       {!isEmailSent ? (
//         <>
//           <Text style={styles.text1}>Enter your email</Text>
//           <TextInput
//             autoCapitalize="none"
//             placeholder="Email"
//             placeholderTextColor={"#dfd8dc"}
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//           />
//           <Button style={styles.text2} onPress={handleSendEmail}>
//             <Text>Send Email</Text>
//           </Button>
//           {error && <Text style={styles.errorText}>{error}</Text>}
//         </>
//       ) : (
//         <>
//           <Text style={styles.subtitle}>Email sent! Check your inbox for the OTP:</Text>
//           <Text style={styles.subtitle}>Remember to change your password once you login!</Text>
//           <TextInput
//             autoCapitalize="none"
//             placeholder="Enter OTP"
//             placeholderTextColor={"#dfd8dc"}
//             style={styles.input}
//             value={otp}
//             onChangeText={setOtp}
//           />
//           <Button style={styles.button} onPress={handleVerifyOTP}>
//             <Text style={styles.buttonText}>Verify OTP</Text>
//           </Button>
//           {error && <Text style={styles.errorText}>{error}</Text>}
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   backButton: {
//     position: 'absolute',
//     top: 60,
//     left: 20,
//     zIndex: 1,
//   },
//   logo: {
//     height: '35%',
//     width: '50%',
//     borderRadius: 60,
//     marginBottom: 20,
//   },
//   title: {
//     color: "black",
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: "bold",
//   },
//   subtitle: {
//     color: "black",
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   input: {
//     borderColor: "black",
//     borderWidth: 1,
//     backgroundColor: "white",
//     width: "100%",
//     borderRadius: 5,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   button: {
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#c7dede",
//     width: "100%",
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: "black",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   text1: {
//     color: "black",
//     marginTop: 20,
//     textAlign: 'left',
//     marginRight: 230,
//     marginBottom: 5,
//   },
//   text2: {
//     color: "black",
//     textAlign: "left",
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//   },
// });

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../../lib/supabase";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleSendEmail = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
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
      // Use the token as the OTP for password reset
      const { error } = await supabase.auth.updateUser({ password: otp }, { accessToken: otp });
      if (error) {
        setError(error.message);
      } else {
        // OTP verification and password reset successful, log the user in
        const { user, session, error: loginError } = await supabase.auth.signIn({ email, password: otp });
        if (loginError) {
          setError(loginError.message);
        } else {
          // User logged in successfully
          navigation.navigate('index'); 
        }
      }
    } catch (error) {
      setError('Error resetting password and logging in: ' + error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forget Password</Text>

      {!isEmailSent ? (
        <>
          <Text style={styles.text1}>Enter your email</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Button style={styles.text2} onPress={handleSendEmail}>
            <Text>Send Email</Text>
          </Button>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Email sent! Check your inbox for the OTP:</Text>
          <Text style={styles.subtitle}>Remember to change your password once you login!</Text>
          <TextInput
            autoCapitalize="none"
            placeholder="Enter OTP"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
          />
          <Button style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </Button>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "black",
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c7dede",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
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
});

