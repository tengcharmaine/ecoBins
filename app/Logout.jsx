import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link } from "expo-router";

export default function LogoutScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            //alignItems: 'flex-start',
            alignItems: 'center',
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
        text: {
            color: "black",
            marginTop: 20,
            textAlign: 'left',
            marginRight: 230,
            marginBottom: 5,
        },
    });

    return (
        <View style= {styles.container}>
            <Image source={require('../images/finalicon.jpeg')}
                   style={{height: '30%', width: '50%', borderRadius: 60}}></Image>
            <Text style= {styles.text}>You have successfully logged out!</Text>
            
            <Link href="/Login">
                <Button style = {styles.button}>
                    <Text>Login</Text>
                </Button>
            </Link>
        </View>
    )
}