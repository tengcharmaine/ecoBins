import { Text, Button, IconButton } from "react-native-paper"
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
// import { useNavigation, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
// import { Ionicons } from '@expo/vector-icons';

export default function editprofilepic() {
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
            width: '25%',
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 10,
            
        },
        defaultButton: {
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
        },

        backButton: {
            position: 'absolute',
            top: 60,
            left: 20,
            zIndex: 1,
        },
    });

    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showButton, setShowButton] = useState(true);
    // const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            // Reset the image state when the screen is focused
            setImage(null);
            setShowButton(true);
        }, [])
    );

    const resetToDefault = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
                    .from('users')
                    .update({ profile: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png' })
                    .eq('id', user.id)
                    .single();
        navigation.goBack();

    };
    
    const handleAddImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                base64: true,
                exif: true,
            });
            if (!result.canceled) {
                if (result.assets[0].uri) {
                    setImage(result.assets[0].uri);
                } else if (result.base64) {
                    setImage(`data:image/jpeg;base64,${result.base64}`);
                }
                setShowButton(false);
            }
    };
    

    const deleteImage = () => {
        setImage(null);
        setShowButton(true);
    };
  
    const saveImage = async () => {
        if (image) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('User ID:', user.id);
      
            // Upload the image file to Supabase storage
            const { data: uploadedData, error: uploadError } = await supabase.storage
              .from('profilepic')
              .upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });
      
            if (uploadError) {
              setError('Error uploading profile picture: ' + uploadError.message);
              return;
            }
      
            console.log(uploadedData);

            // Get the public URL of the uploaded image
            const { data: publicUrl, error: getUrlError } = await supabase.storage
              .from('profilepic')
              .getPublicUrl(uploadedData.path);
            
            if (getUrlError) {
              setError('Error retrieving public URL: ' + getUrlError.message);
              return;
            }
      
            const uploadedImage = publicUrl;
            console.log(publicUrl);
      
            // Update the user's profile picture URL in the users table
            const { data: updateUserData, error: updateUserError } = await supabase
              .from('users')
              .update({ profile: uploadedImage.publicUrl })
              .eq('id', user.id)
              .single();
      
            if (updateUserError) {
              setError('Error updating user profile picture: ' + updateUserError.message);
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
      
    //   const goBack = () => {
    //     navigation.navigate('settings');
    //   }
      
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
            </TouchableOpacity>
            <Text style={styles.title}>Change profile picture</Text>
            {image && (<View>
                <Image source={{ uri: image }} style={{ width: 270, height: 270 }} />
                <IconButton
                    icon="delete"
                    size={30}
                    color="black"
                    onPress={deleteImage}
                    style={{ position: 'absolute', top: 0, right: 0 }}
                />
            </View>)}
            {showButton && (
                <Button onPress={handleAddImage} style={styles.button2}>
                    <Text style={styles.text}>Choose new profile picture</Text>
                </Button>
            )}
            {error !== null && <Text style={styles.error}>{error}</Text>}
            <Button style={styles.button} onPress={saveImage}>
                <Text style={styles.text}>Confirm</Text>
            </Button>
            <Button style={styles.defaultButton} onPress={resetToDefault}>
                <Text style={styles.text}>Reset to Default</Text>
            </Button>
        </View> 
    );
}