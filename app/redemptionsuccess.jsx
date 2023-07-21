import { Text, Button } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { Link, useNavigation } from "expo-router";

export default function RedemptionSuccess() {
    const navigation= useNavigation();
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
            borderRadius: 10,
        },
        button1: {
            borderColor: "black",
            alignItems: 'center',
            backgroundColor: "#c7dede",
            width: '50%',
            marginTop: 20,
            borderRadius: 10,
        },
        text: {
            color: "black",
            marginTop: 20,
            textAlign: 'center',
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

    const handlegorewards = () => {
        navigation.navigate('Rewards');
    };
      
    return (
        <View style={styles.container}>
            <Image source={{uri: "https://media4.giphy.com/media/12uXi1GXBibALC/giphy.gif?cid=ecf05e47a619ods1d589dxd1t03ukj56ssxnu0h63pqrd7vj&ep=v1_gifs_search&rid=giphy.gif&ct=g" }}
                   style={{height: '25%', width: '75%', borderRadius: 60}}></Image>            
            <Text style={styles.text}>Your redemption is successfull! Enjoy your food!</Text>
            <Button style = {styles.button} onPress={handlegorewards}>
                <Text style={styles.text1}>Redeem another</Text>
            </Button>
        </View>
    )
}