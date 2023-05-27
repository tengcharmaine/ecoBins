import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg("Email cannot be empty")
            return;
        }
        if (password == '') {
            setErrMsg("Password cannot be empty")
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
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
        
    });

    return (
        <View style={styles.container}>
            <Text style= {styles.text1}>Email</Text>
            <TextInput
                autoCapitalize='none'
                placeholder="Email"
                placeholderTextColor={"#dfd8dc"}
                style={styles.input}
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
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
            <Button style = {styles.button} onPress={handleSubmit}>
                <Text style={styles.text1}> Register </Text>
            </Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}