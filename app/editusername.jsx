import { Text, Button, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from "react";
import { supabase } from "../lib/supabase";

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
      color: "black", // Set the button text color to black
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

      // Update the user's username in the Supabase table
      const { data, error } = await supabase
        .from('users')
        .update({ username: name })
        .eq('user_id', user.id)
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

  return (
    <View style={styles.container}>
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
      <Button style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.text1}>Cancel</Text>
      </Button>
    </View>
  );
}
