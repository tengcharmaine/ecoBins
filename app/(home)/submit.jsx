import { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter, Link } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Pick from '../pick';

export default function SubmitScreen() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [errMsg, setErrMsg] = useState('');
    const { user } = useAuth();
    const router = useRouter();
    const [showButton, setShowButton] = useState(true);

    const handleAddImage = async () => {
        
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                                                                 allowsEditing: true});
        //setShowButton(false);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setShowButton(false);
        }
        
    }

    const handleSubmit = async () => {
        setErrMsg('');
        if (image === null) {
            setErrMsg('Image cannot be empty')
            return;
        }
        setLoading(true);
        let uploadedImage = null;
        if (image != null) {
            const { data, error } = await supabase.storage.from('images').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

            if (error != null) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            uploadedImage = publicUrl;
        } else if (image == null) {
            if (error) {
                console.log(error);
                setErrMsg(error.message)
                setLoading(false);
                return;
            }
        }
        const { error } = await supabase.from('submissions').insert({ user_id: user.id, image_url: uploadedImage }).select().single();
        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }
        setLoading(false);
        router.push('/');
    }

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
        },
        button: {
            borderColor: "black",
            alignItems: 'center',
            backgroundColor: "#c7dede",
            width: '25%',
            marginTop: 20,
            marginBottom: 10,
            marginLeft: 10,
            borderRadius: 10,
        },
        button2: {
            borderColor: "black",
            backgroundColor: "#cccc",
            width: '75%',
            height: '45%',
            marginTop: 20,
            marginLeft: 10,
            borderRadius: 10,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        text: {
            color: "black",
            marginBottom: 10,
            fontSize: 15,
            textAlign: 'center',
            flex: 1,
            width: '90%'
        },
        text1: {
            color: "black",
            marginTop: 15,
            textAlign: 'left',
            marginRight: 255,
            marginBottom: 5,
        },
        text2: {
            color: "black",
            marginTop: 10,
            marginBottom: 5,
            fontSize: 15,
            textAlign: 'center',
            width: '70%',
        },
        title: {
            color: "black",
            fontSize: 20,
            marginBottom: 10, 
            marginLeft: 20,
            marginTop: 30,
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
             {/* <Text style={styles.title}>Instructions: </Text>
             <Text style={styles.text}>- Fill in this 
                <Link href='https://forms.gle/WzBJumoQ7AZPihnM9'> Google Form </Link>
                with the relevant information.</Text>
             <Text style={styles.text}>- Screenshot and upload a picture of the confirmation email below.</Text> */}
             <Text style={styles.text2}>Hi! Please upload a photo of all the items you are recycling and indicate where you are recycling them at!</Text>
             
             {image && <Image source={{ uri: image }} style={{ width: 270, height: 270 }} />}
             {showButton && <Button onPress={handleAddImage}
                     style={styles.button2}>
                        {<Text style={styles.text}>Upload Photo here!</Text>}
             </Button>}
             {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
             <Pick />
             <Button onPress={handleSubmit}
                     style={styles.button}>
                <Link style={styles.text1}
                      href='/SubmissionComplete'>Submit</Link>
             </Button>
             {loading && <ActivityIndicator />}
         </View>
    );
}