import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [emailErrMsg, setEmailErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');

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
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }

        navigation.navigate('Login');
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            alignItems: 'center',
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
        <View style={styles.container}>
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
        </View>
    );
}