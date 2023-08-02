import { Text, Button, IconButton } from "react-native-paper"
import { StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


export default function editprofilepic() {

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
            alignItems: 'center',
            backgroundColor: "white",

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
            justifyContent: 'center',
            backgroundColor: "#c7dede",
            width: '85%',
            height: 60,
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 20,
        },
        defaultButton: {
            borderColor: "black",
            alignItems: 'center',
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
            fontSize: 19,
            textAlign: 'center',
            fontFamily: 'PoppinsSemiBold',
            justifyContent: 'center'
        },

        text1: {
            marginTop: 20,
            color: "black",
            marginBottom: 10,
            fontSize: 15,
            textAlign: 'center',
            width: '70%',
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

        button2: {
            borderColor: "black",
            borderStyle: 'dashed',
            borderWidth: 1,
            backgroundColor: "#dedede",
            width: '80%',
            height: '45%',
            marginTop: 60,
            marginLeft: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },

        error: {
            color: "red",
            fontFamily: 'Poppins',
            marginTop: 10,
        },

        backButton: {
            position: 'absolute',
            top: 60,
            left: 20,
            zIndex: 1,
        },
        uploadImage: {
            width: 90,
            height: 90,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
    });

    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [showButton, setShowButton] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

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
      setLoading(true);
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
            setLoading(false);

            navigation.goBack();
            
          } catch (error) {
            setError('Error updating profile picture: ' + error.message);
          }
        } else {
          setError('No image selected. Please choose a profile picture.');
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
            {/* <Text style={styles.title}>Change profile picture</Text> */}
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
                <TouchableOpacity onPress={handleAddImage} style={styles.button2}>
                    <Image source={require("../images/profile.png")} style={styles.uploadImage} />
                    <Text style={styles.text1}>Choose a new profile picture</Text>
                </TouchableOpacity>
            )}
            {error !== null && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={saveImage}>
                {loading ? <Text style={styles.text}>Loading...</Text> : <Text style={styles.text}>Confirm</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.defaultButton} onPress={resetToDefault}>
                <Text style={styles.text}>Reset to Default</Text>
            </TouchableOpacity>
        </View> 
    );
}
