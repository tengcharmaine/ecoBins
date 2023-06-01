import { StyleSheet, View, Image } from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            //alignItems: 'flex-start',
            alignItems: 'center',
        },
        input: {
            borderColor: "black",
            borderWidth: 1,
            backgroundColor: "white",
            width: '75%',
            borderRadius: 5
            //textAlign: 'center',
            //justifyContent: 'center',
            //flex: 1, justifyContent: 'center', width: '75%', alignContent: 'center',
        },
        button: {
            borderColor: "black",
            alignItems: 'center',
            //justifyContent: 'center',
            backgroundColor: "#c7dede",
            width: '25%',
            marginTop: 20,
            marginBottom: 10,
            //marginRight: 200,
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
        }
        
    });

    return (
        <View style= {styles.container}>
            <Image source={require('./../../images/finalicon.jpeg')}
                   style={{height: '30%', width: '50%', borderRadius: 60}}></Image>
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
            
            {errMsg !== "" && <Text style= {styles.error}>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/Register">
                <Button style = {styles.text2}>
                    <Text>First time user? Register here.</Text>
                </Button>
            </Link>
        </View>
    )
}