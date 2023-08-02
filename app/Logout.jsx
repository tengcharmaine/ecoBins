import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from '../lib/supabase';
import { useFonts } from 'expo-font';
import { TouchableOpacity } from "react-native-gesture-handler";


export default function LogoutScreen() {

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
            backgroundColor: 'white'
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
        text: {
            color: "black",
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
        },
        text1: {
            marginTop: 20,
            color: "black",
            marginBottom: 10,
            fontSize: 21,
            alignSelf: 'center',
            textAlign: 'center',
            width: '70%',
            fontFamily: 'PoppinsSemiBold',
        },

    });

    if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }

    return (
        <View style= {styles.container}>
            <Image source={require('../images/finalicon.jpeg')}
                   style={{height: '40%', width: '70%', borderRadius: 60, resizeMode: 'contain', alignSelf: 'center'}}></Image>
            <Text style= {styles.text1}>You have successfully logged out!</Text>
            
            <TouchableOpacity style = {styles.button} onPress={() => supabase.auth.signOut()}>
                <Text  style= {styles.text}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}