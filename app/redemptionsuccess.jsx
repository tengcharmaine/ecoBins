import { Text, Button } from "react-native-paper";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useFonts } from 'expo-font';
import { TouchableOpacity } from "react-native-gesture-handler";


export default function RedemptionSuccess() {
    const [loaded] = useFonts({
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
        PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
        PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
      });
    
    const navigation= useNavigation();
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
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
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: "#c7dede",
            width: '85%',
            height: 60,
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 20,
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
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
        },

        text1: {
            color: "black",
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
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

    if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }
      
    return (
        <View style={styles.container}>
            <Image source={{uri: "https://media4.giphy.com/media/12uXi1GXBibALC/giphy.gif?cid=ecf05e47a619ods1d589dxd1t03ukj56ssxnu0h63pqrd7vj&ep=v1_gifs_search&rid=giphy.gif&ct=g" }}
                   style={{height: '25%', width: '75%', borderRadius: 60, marginBottom: 50, alignSelf: 'center'}}></Image>            
            <Text style={styles.text}>Your redemption is successful! {'\n'} Enjoy your food!</Text>
            <TouchableOpacity style = {styles.button} onPress={handlegorewards}>
                <Text style={styles.text1}>Redeem another</Text>
            </TouchableOpacity>
        </View>
    )
}
