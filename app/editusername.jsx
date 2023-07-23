import { Text, Button, TextInput } from "react-native-paper";
import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';



export default function editusername() {
  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBlack: require('../assets/fonts/Poppins-Black.ttf'),

    // Add other Poppins variants here (e.g., Poppins-Bold, Poppins-Italic, etc.) if needed.
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    input: {
      borderColor: "white",
      borderWidth: 1,
      borderBottomColor: "grey",
      backgroundColor: "white",
      width: '75%',
    },
    button: {
      borderColor: "black",
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#c7dede",
      width: '85%',
      height: 60,
      marginTop: 20,
      marginBottom: 10,
      borderRadius: 20,
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
      marginTop: 20,
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 34,
      textAlign: 'left',
      marginRight: 40,
      marginBottom: 15,
      fontFamily: 'PoppinsBold',
    },
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    emailIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      marginRight: 20,
    },
    errorText: {
      color: "red",
      //marginTop: 10,
      fontFamily: 'Poppins',
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 20,
      zIndex: 1,
    },
  });

  const [name, setname] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const saveUsername = async () => {
    if (!name) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Check if the new username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', name)
        .single();

      if (existingUser) {
        setError('Username is already taken. Please choose a different username.');
        return;
      }

      // Update the user's username in the Supabase table
      const { data, error } = await supabase
        .from('users')
        .update({ email: name })
        .eq('id', user.id)
        .single();

      if (error) {
        setError('Error updating username: ' + error.message);
        return;
      }

      console.log('Username updated successfully!');
      navigation.goBack();
    } catch (error) {
      setError('Error updating username: ' + error.message);
    }
  };

  const goBack = () => {
    navigation.navigate('settings');
  }

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Change username</Text>
      <View style= {styles.innerContainer}>
          <Image
            source={require('./../images/user-pen.png')}
            style={styles.emailIcon}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Username"
            placeholderTextColor={"#dfd8dc"}
            style={styles.input}
            textContentType="username"
            value={name}
            onChangeText={setname}
          />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={saveUsername}>
        <Text style={styles.text1}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}
