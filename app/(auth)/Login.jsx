import { View } from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, ActivityIndicator, TextInputStyle } from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { green } from "../../colours/colours";

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
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Email</Text>
            <TextInput
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail} />
            <Text>Password</Text>
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword} />
            <Button onPress={handleSubmit}>Submit</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/Register">
                <Button>First time user? Register here.</Button>
            </Link>
        </View>
    )
}