import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    const [showEmailCheck, setShowEmailCheck] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);


    const handleSubmit = async () => {
        setErrMsg('');
        setEmailErrMsg('');
        if (email === '' && password === '') {
            setEmailErrMsg("Email cannot be empty");
            setPasswordErrMsg("Password cannot be empty");
            return;
          } else if (password === '') {
            setPasswordErrMsg("Password cannot be empty");
            return;
          } else if (!isPasswordValid(password)) {
            setPasswordErrMsg('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
        console.log(email)

        setShowEmailCheck(true); // Show the "Check your email" message

        navigation.navigate('Login');
    }

    const showVerificationAlert = () => {
        Alert.alert(
            'Email Verification',
            'Please check your email for the verification link.',
            [
                { text: 'OK' },
            ]
        );
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        const minLength = 8;
    
        return password.length >= minLength && passwordRegex.test(password);
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
                    <Text style= {styles.title}> Registration </Text>
                    <Text style= {styles.text1}>Email</Text>
                    <TextInput
                        autoCapitalize='none'
                        placeholder="Email"
                        placeholderTextColor={"#dfd8dc"}
                        style={styles.input}
                        textContentType='emailAddress'
                        value={email}
                        onChangeText={setEmail} />
                    {emailErrMsg !== "" && <Text style= {styles.error}>{emailErrMsg}</Text>}
        
                    <Text style= {styles.text2}>Password</Text>
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
                        <Text style={styles.text1}> Enter </Text>
                    </Button>          
                    {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
                    {loading && <ActivityIndicator />}
                    {showEmailCheck && showVerificationAlert()}
                </View>
            </KeyboardAwareScrollView>
            );
}