import { Alert, FlatList, Pressable, View, StyleSheet } from 'react-native';
// import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Checkbox, Text, Button } from 'react-native-paper';
import { useRouter, Stack, Link } from 'expo-router';
import UploadImage from '../uploadimage';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            //alignItems: 'flex-start',
            alignItems: 'center',
            padding: 50,
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

        text2: {
            color: "black",
            textAlign: "left",
        },

        text3: {
            color: "black",
            marginTop: 20,
            textAlign: 'left',
            marginRight: 255,
            marginBottom: 5,
        },

    });

    return (
        <View style={styles.container}>
            <UploadImage/>
            <Text style={{marginVertical:20,fontSize:16}}>Welcome, FuzzySid</Text>
            <Button style = {styles.button}>
                <Link style={styles.text1} href='/Logout'>Logout</Link>
            </Button>
        </View>
    )
}

//     const [todos, setTodos] = useState([]);
//     const [refreshing, setRefreshing] = useState(false);

//     async function fetchTodos() {
//         setRefreshing(true);
//         let { data } = await supabase.from('todos').select('*');
//         setRefreshing(false);
//         setTodos(data);
//     }

//     useEffect(() => {
//         fetchTodos();
//     }, []);

//     useEffect(() => {
//         if (refreshing) {
//             fetchTodos();
//             setRefreshing(false);
//         }
//     }, [refreshing]);

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <FlatList
//                 data={todos}
//                 renderItem={({ item }) => <TodoItem todo={item} />}
//                 onRefresh={() => setRefreshing(true)}
//                 refreshing={refreshing}
//             />
//         </View>
//     );
// }

// function TodoItem({ todo }) {
//     const [checked, setChecked] = useState(todo.is_complete)
//     const router = useRouter();
//     const handleCheckboxPress = async () => {
//         const { error } = await supabase.from('todos').update({ is_complete: !checked }).eq('id', todo.id)
//         if (error != null) {
//             Alert.alert(error.message);
//         }
//         setChecked(!checked)
//     }
//     const handleItemPress = () => {
//         router.push({ pathname: '/detailedTodo', params: { id: todo.id } })
//     }
//     return (
//         <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleItemPress}>
//             <Text>{todo.task}</Text>
//             <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={handleCheckboxPress} />
//         </Pressable>
//     )
// }