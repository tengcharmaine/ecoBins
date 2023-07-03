import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Alert } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
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

    

    const handleSubmit = async () => {
        setErrMsg('');
        setEmailErrMsg('');
        if (email == '') {
            setEmailErrMsg("Email cannot be empty")
            return;
        }
        setPasswordErrMsg('');
        if (password == '') {
            setPasswordErrMsg("Password cannot be empty")
            return;
        }
    
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setEmail(email);
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
        console.log(email)

        setShowEmailCheck(true); // Show the "Check your email" message
   
        navigation.navigate('Login');
    };



    const showVerificationAlert = () => {
                Alert.alert(
                    'Email Verification',
                    'Please check your email for the verification link.',
                    [
                        { text: 'OK' },
                    ]
                );
            };
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center', 
        },
        innerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10%', // Adjust the margin as needed
            marginBottom: 30, 
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
            <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={"#dfd8dc"}
                style={styles.input}
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
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