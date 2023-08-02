import { Text, Button, TextInput } from "react-native-paper";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { supabase } from "../lib/supabase";
// import { Ionicons } from '@expo/vector-icons';


export default function editusername() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      borderColor: "black",
      borderWidth: 1,
      backgroundColor: "white",
      width: "75%",
      borderRadius: 5,
    },
    button: {
      borderColor: "black",
      alignItems: "center",
      backgroundColor: "#c7dede",
      width: "25%",
      marginTop: 20,
      borderRadius: 10,
      color: "black", 
    },
    text1: {
      color: "black",
      marginTop: 20,
      textAlign: "left",
      marginRight: 230,
      marginBottom: 5,
    },

    title: {
      color: "black",
      fontSize: 20,
      marginBottom: 20,
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      marginTop: 10,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
          {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
      </TouchableOpacity>
      <Text style={styles.title}>Change username</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="Username"
        placeholderTextColor={"#dfd8dc"}
        style={styles.input}
        textContentType="username"
        value={name}
        onChangeText={setname}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button style={styles.button} onPress={saveUsername}>
        <Text style={styles.text1}>Confirm</Text>
      </Button>
    </View>
  );
}