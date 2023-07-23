import { Text, Button } from "react-native-paper";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useFonts } from 'expo-font';
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SubmissionComplete() {
    const router = useRouter();

    const navigation= useNavigation();
    const [loaded] = useFonts({
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
        PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
        PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),
    
      });
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            //alignItems: 'center',
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
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: "#dedede",
            width: '85%',
            height: 60,
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 20,
            
        },
        text: {
            color: "black",
            fontWeight: 'bold',
            fontSize: 24,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
            marginTop: 30,
        },

        text1: {
            color: "black",
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
        },
        text2: {
            color: "black",
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
            marginTop: 10,
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

    if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }

    const handlegosubmit = () => {
        navigation.goBack();
    };

    const handlegorewards = () => {
        router.push('rewards');
    };
    
    return (
        <View style={styles.container}>
            <Image source={{uri: "https://media0.giphy.com/media/DyQrKMpqkAhNHZ1iWe/giphy.gif?cid=ecf05e47bdzn0x5gumv2v08hecawsy486c2dzd9blc87s8tg&ep=v1_gifs_search&rid=giphy.gif&ct=g" }}
                   style={{height: '30%', width: '60%', borderRadius: 60, alignSelf: 'center'}}></Image>            
            <Text style={styles.text}>Your submission is successful!</Text>
            <Text style={styles.text2}>+1 point for redemption</Text>
            <TouchableOpacity style = {styles.button} onPress={handlegosubmit}>
                <Text style={styles.text1}>Submit another</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button1} onPress={handlegorewards}>
                <Text style={styles.text1}>Redeem here!</Text>
            </TouchableOpacity>
        </View>
    )
}