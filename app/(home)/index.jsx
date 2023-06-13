import { Alert, FlatList, Pressable, View, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Checkbox, Text, Button } from 'react-native-paper';
import { useRouter, Stack, Link } from 'expo-router';
import UploadImage from '../uploadimage';
import * as ImagePicker from 'expo-image-picker';
//import {supabase} from '../lib/supabase';

export default function HomeScreen() {
    const [remainingPoints, setRemainingPoints] = useState(0);
    const router = useRouter();
    useEffect(() => {
      // Fetch the user's score or remaining points from Supabase or any other data source
      const fetchRemainingPoints = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
  
          console.log(user);
          if (user) {
            const { data, error } = await supabase
            .from('ranking')
            .select('score')
            .eq('username', user.id); 
            console.log(2);
            if (error) {
              console.error('Error fetching user points1:', error.message);
              return;
            }
  
            if (data.length > 0) {
              const userScore = data[0].score;
              setRemainingPoints(userScore);
              console.log(userScore);
            } else {
              // Handle the case when there are no matching records
              console.log('No data found for the user');
            }
          } else {
            console.log('not auth');
          }
        } catch (error) {
          console.error('Error fetching user points2:', error.message);
        }
      };
  
      fetchRemainingPoints();
    }, []); // Run this effect only once, on component mount

    //const FriendsList = () => {
        const [friends, setFriends] = useState([]);
      
        useEffect(() => {
          // Fetch friends list from Supabase
          const fetchFriends = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase.from('friends').select('*').eq('user_id', user.id);
                if (error) {
                console.error(error);
                } else {
                console.log(data);
                setFriends(data);
                }
            }
            
          };
      
          fetchFriends();
        }, []);
      
    const renderFriendItem = ({ item }) => (
      <View style={styles.friendItem}>
        <Text style={styles.friendName}>{item.friendname}</Text>
        {/*<Text style={styles.friendStatus}>{item.status}</Text>*/}
        </View>
    );

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

        friendsList: {
            //marginTop: 10,
            flexDirection: 'row',
        //alignItems: 'center',
        //justifyContent: 'space-between',
        //backgroundColor: '#c7dede',
        borderRadius: 30,
        height: 95,
          },
          friendItem: {
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
            paddingVertical: 10,
            paddingHorizontal: 100,
            //backgroundColor: '#c7dede',
          },
          friendName: {
            fontSize: 16,
            fontWeight: 'bold',
            backgroundColor: '#c7dede',
            width: 100,
          },
          friendStatus: {
            marginTop: 5,
            color: 'gray',
          },
    });

    return (
        <View style={styles.container}>
            <UploadImage/>
            <Text style={{marginVertical:20,fontSize:16}}>Welcome, FuzzySid</Text>
            <Text style={{fontSize:16}}>You have {remainingPoints} points accumulated so far.</Text>
            <Text style={{marginVertical:20, fontSize:16}}>My friends</Text>
            <FlatList

                data={friends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderFriendItem}
                style={styles.friendsList}
            />
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