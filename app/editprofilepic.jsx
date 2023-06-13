import { Text, Button } from "react-native-paper"
import { StyleSheet, View, Image } from "react-native";
import { useNavigation, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function editprofilepic() {
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            //alignItems: 'flex-start',
            alignItems: 'center',
        },
        input: {
            borderColor: "black",
            borderWidth: 1,
            backgroundColor: "white",
            width: '75%',
            borderRadius: 5
            //textAlign: 'center',
            //justifyContent: 'center',
            //flex: 1, justifyContent: 'center', width: '75%', alignContent: 'center',
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
            marginTop: 10,
            marginBottom: 10,
            fontSize: 15,
            textAlign: 'center',
            width: '70%',
        },

        text1: {
            color: "black",
            marginTop: 20,
            textAlign: 'left',
            marginRight: 230,
            marginBottom: 5,
        },

        title: {
            color: "black",
            fontSize: 20,
            marginBottom: 20, 
            fontWeight: "bold",
        },

        button2: {
            borderColor: "black",
            backgroundColor: "#cccc",
            width: '75%',
            height: '40%',
            marginTop: 20,
            marginLeft: 10,
            borderRadius: 10,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },

        error: {
            color: "red",
        }
    });

    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showButton, setShowButton] = useState(true);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // Reset the image state when the screen is focused
            setImage(null);
            setShowButton(true);
        }, [])
    );
    
    const handleAddImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                                                                 allowsEditing: true});
        //setShowButton(false);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setShowButton(false);
        }
    }

    const saveImage = async () => {
        if (image) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
        
                // Update the user's profile picture in the Supabase table
                const { data, error } = await supabase
                    .from('users')
                    .update({ profile_picture: image })
                    .eq('user_id', user.id)
                    .single();
        
                if (error) {
                    setError('Error updating profile picture: ' + error.message);
                    return;
                }
        
                console.log('Profile picture updated successfully!');
                navigation.goBack();
            } catch (error) {
                setError('Error updating profile picture: ' + error.message);
            }
        } else {
            setError('No image selected. Please choose a profile picture.');
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change profile picture</Text>
            {image && <Image source={{ uri: image }} style={{ width: 270, height: 270 }} />}
            {showButton && (
                <Button onPress={handleAddImage} style={styles.button2}>
                    <Text style={styles.text}>Choose new profile picture</Text>
                </Button>
            )}
            {error !== null && <Text style={styles.error}>{error}</Text>}
            <Button style={styles.button} onPress={saveImage}>
                <Text style={styles.text}>Confirm</Text>
            </Button>
            <Button style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.text}>Cancel</Text>
            </Button>
        </View> 
    );
}