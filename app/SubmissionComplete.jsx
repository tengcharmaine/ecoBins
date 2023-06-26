import { Text, Button } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { Link } from "expo-router";

export default function SubmissionComplete() {
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
            width: '40%',
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 10,
            
        },
        text: {
            color: "black",
            marginTop: 20,
            fontSize: 25,
            marginBottom: 0,
        },

        text1: {
            color: "black",
            marginLeft: 5,
            flexWrap: 'wrap',
            flex: 1,
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
            <Image source={{uri: "https://media0.giphy.com/media/DyQrKMpqkAhNHZ1iWe/giphy.gif?cid=ecf05e47bdzn0x5gumv2v08hecawsy486c2dzd9blc87s8tg&ep=v1_gifs_search&rid=giphy.gif&ct=g" }}
                   style={{height: '30%', width: '60%', borderRadius: 60}}></Image>            
            <Text style={styles.text}>Your submission is successfull!</Text>
            <Button style = {styles.button}>
                <Link style={styles.text1}
                        href='/submit'>Submit another</Link>
            </Button>
        </View>
    )
}