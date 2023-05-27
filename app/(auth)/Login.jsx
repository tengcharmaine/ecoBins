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
    const handleSubmit = async () => {
        setErrMsg('');
        if (email == '') {
            setErrMsg("Email cannot be empty")
            return;
        }
        if (password == '') {
            setErrMsg("Password cannot be empty")
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
            borderRadius: 10
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
            //marginTop: 30,
            //borderWidth: 1, borderColor: "black", textAlign: "left",
            //marginRight:5,
            //width: "75%",
        },
        
    });

    return (
        <View style= {styles.container}>
            <Image source={require('./../../images/icon.png')}
                   style={{height: '30%', width: '50%', borderRadius: 60}}></Image>
            <Text style= {styles.text1}>Username</Text>
            <TextInput
                placeholder='Username'
                style={styles.input}
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            <Text style= {styles.text1}>Password</Text>
            <TextInput
                secureTextEntry
                style={styles.input}
                placeholder='Password'
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />

            <Button style = {styles.button} onPress={handleSubmit}>
                <Text style={styles.text1}> Login </Text>
            </Button>
            
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/Register">
                <Button style = {styles.text2}>
                    <Text>First time user? Register here.</Text>
                </Button>
            </Link>
        </View>
    )
}