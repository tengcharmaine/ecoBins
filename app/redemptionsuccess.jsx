import { Text, Button } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { Link } from "expo-router";

export default function RedemptionSuccess() {
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
            textAlign: 'center',
            //marginRight: 255,
            fontSize: 25,
            marginBottom: 0,
            //flexGrow: 1,
            //flexDirection: 'row',
        },

        text1: {
            color: "black",
            //marginTop: 20,
            //textAlign: 'left',
            marginLeft: 5,
            //justifyContent: 'center',
            flexWrap: 'wrap',
            flex: 1,
            //width: 1
            //marginRight: 230,
            //marginBottom: 5,
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
            <Image source={{uri: "https://media4.giphy.com/media/12uXi1GXBibALC/giphy.gif?cid=ecf05e47a619ods1d589dxd1t03ukj56ssxnu0h63pqrd7vj&ep=v1_gifs_search&rid=giphy.gif&ct=g" }}
                   style={{height: '25%', width: '75%', borderRadius: 60}}></Image>            
            <Text style={styles.text}>Your redemption is successfull! Enjoy your food!</Text>
            <Button style = {styles.button}>
                <Link style={styles.text1}
                        href='/rewards'>Redeem another</Link>
            </Button>
        </View>
    )
}