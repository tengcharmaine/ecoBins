import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Linking from 'expo-linking';


export default function PasswordRecovery() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");


    const handlePasswordRecovery = async () => {
        setErrMsg("");
        const deepLink = Linking.createURL('/reset-password');
    
        if (email === "") {
          setErrMsg("Email cannot be empty");
          return;
        }
    
        setLoading(true);

        //const { data: { user } } = await supabase.auth.getUser()
        // Get the user object based on the email
        const { data: users, userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

        if (userError) {
        setLoading(false);
        setErrMsg(error.message);
        return;
        }

        if (!users) {
        setLoading(false);
        setErrMsg("User not found");
        return;
        }

        const userId = users.id;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: deepLink + `?userId=${userId}`,
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
            justifyContent: 'center', 
        },
        innerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10%', 
            marginBottom: 30, 
        },
        input: {
            borderColor: "black",
            borderWidth: 1,
            backgroundColor: "white",
            width: '75%',
            borderRadius: 5
        },
        passwordInput: {
            backgroundColor: "white",
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
            marginRight: 255,
            marginBottom: 5,
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
            fontSize: 20,
            marginBottom: 20, 
            fontWeight: "bold",
        },
        error: {
            color: "red",
            marginTop: 4,
            marginBottom: 5,
            textAlign: 'center'
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
              scrollEnabled={true}>
                <View style={styles.innerContainer}>
                    <Text style= {styles.title}> Forgot Password? </Text>
                    <Text style= {styles.text1}>Email</Text>
                    <TextInput
                        autoCapitalize='none'
                        placeholder="Email"
                        placeholderTextColor={"#dfd8dc"}
                        style={styles.input}
                        textContentType='emailAddress'
                        value={email}
                        onChangeText={setEmail} />
                    {/* {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>} */}
        
                    <Button style = {styles.button} onPress={handlePasswordRecovery}>
                        <Text style={styles.text1}> Enter </Text>
                    </Button>          
                    {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
                    {loading && <ActivityIndicator />}
                    {/* {showEmailCheck && showVerificationAlert()} */}
                </View>
            </KeyboardAwareScrollView>
            );
}

// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import React, { useState } from "react";
// import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
// import { Link, useFocusEffect } from "expo-router";
// import { supabase } from "../../lib/supabase";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { useNavigation } from '@react-navigation/native';

// export default function PasswordRecovery() {
//   const [email, setEmail] = useState('');
//   //const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errMsg, setErrMsg] = useState('');
//   const [emailErrMsg, setEmailErrMsg] = useState('');
//   //const [passwordErrMsg, setPasswordErrMsg] = useState('');
//   //const [passwordVisible, setPasswordVisible] = useState(false);

//   const navigation = useNavigation();

//   const handleSubmit = async () => {
//     setErrMsg('');
//     setEmailErrMsg('');
//     setPasswordErrMsg('');

//     if (email === '') {
//       setEmailErrMsg("Email cannot be empty");
//       return;
//     } 

//     setLoading(true);
//     const { error } = await supabase.auth.signInWithOtp({ email });
//     setLoading(false);

//     if (error) {
//       setErrMsg(error.message);
//       return;
//     }

//     //navigation.navigate('OTPScreen', { email });
//   };

//   const styles = StyleSheet.create({
//             container: {
//                 flex: 1, 
//                 justifyContent: 'center', 
//             },
//             innerContainer: {
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginTop: '10%', 
//                 marginBottom: 30, 
//             },
//             input: {
//                 borderColor: "black",
//                 borderWidth: 1,
//                 backgroundColor: "white",
//                 width: '75%',
//                 borderRadius: 5
//             },
//             passwordInput: {
//                 backgroundColor: "white",
//                 borderRadius: 5
//             },
//             button: {
//                 borderColor: "black",
//                 alignItems: 'center',
//                 backgroundColor: "#c7dede",
//                 width: '25%',
//                 marginTop: 20,
//                 marginBottom: 10,
//                 borderRadius: 10,
                
//             },
//             text1: {
//                 color: "black",
//                 marginTop: 20,
//                 textAlign: 'left',
//                 marginRight: 255,
//                 marginBottom: 5,
//             },
    
//             text2: {
//                 color: "black",
//                 marginTop: 20,
//                 textAlign: 'left',
//                 marginRight: 230,
//                 marginBottom: 5,
//             },
    
//             title: {
//                 color: "black",
//                 fontSize: 20,
//                 marginBottom: 20, 
//                 fontWeight: "bold",
//             },
//             error: {
//                 color: "red",
//                 marginTop: 4,
//                 marginBottom: 5,
//                 textAlign: 'center'
//             },
//             passwordIcon: {
//                 position: 'absolute',
//                 right: 10,
//                 top: '30%',
//                 transform: [{ translateY: -12 }],
//               },
            
//         });

//   return (
//     <KeyboardAwareScrollView
//               contentContainerStyle={styles.container}
//               resetScrollToCoords={{ x: 0, y: 0 }}
//               scrollEnabled={true}>
//                 <View style={styles.innerContainer}>
//                     <Text style= {styles.title}> Forgot Password? </Text>
//                     <Text style= {styles.text1}>Email</Text>
//                     <TextInput
//                         autoCapitalize='none'
//                         placeholder="Email"
//                         placeholderTextColor={"#dfd8dc"}
//                         style={styles.input}
//                         textContentType='emailAddress'
//                         value={email}
//                         onChangeText={setEmail} />
//                     {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>}
        
//                     <Button style = {styles.button} onPress={handleSubmit}>
//                         <Text style={styles.text1}> Enter </Text>
//                     </Button>          
//                     {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
//                     {loading && <ActivityIndicator />}
//                     {/* {showEmailCheck && showVerificationAlert()} */}
//                 </View>
//             </KeyboardAwareScrollView>
//             );
// }
