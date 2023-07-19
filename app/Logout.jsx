import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from '../lib/supabase';

export default function LogoutScreen() {

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            alignItems: 'center',
            backgroundColor: 'white'
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
        text: {
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 5,
            fontSize: 20,
        },
    });

    return (
        <View style= {styles.container}>
            <Image source={require('../images/finalicon.jpeg')}
                   style={{height: '25%', width: '50%', borderRadius: 60}}></Image>
            <Text style= {styles.text}>You have successfully logged out!</Text>
            
            <Button style = {styles.button} onPress={() => supabase.auth.signOut()}>
                <Text>Login</Text>
            </Button>
        </View>
    )
}