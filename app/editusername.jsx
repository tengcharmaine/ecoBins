import { Text, Button } from "react-native-paper"
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";

export default function editusername() {
    function cancel() {
        return (
            <Link href='/(home)/index.jsx'/>
        );
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
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change username</Text>
            <TextInput
                autoCapitalize='none'
                placeholder="Username"
                placeholderTextColor={"#dfd8dc"}
                style={styles.input}
                textContentType='username'
                value={username}
                onChangeText={setusername} />
            {/* {usernameErrMsg !== "" && <Text style= {styles.error}>{usernameErrMsg}</Text>} */}
            <Button style={styles.button}>Confirm</Button>
            <Button style={styles.button} onPress={cancel}>Cancel</Button>
        </View> 
    );
}