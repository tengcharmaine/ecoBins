import { Alert, FlatList, Pressable, View, StyleSheet, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState, useCallback } from 'react';
import { Checkbox, Text, Button, IconButton } from 'react-native-paper';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
    const [remainingPoints, setRemainingPoints] = useState(0);
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [friends, setFriends] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
          const fetchRemainingPoints = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
    
              if (user) {
                const { data, error } = await supabase
                  .from('ranking')
                  .select('score')
                  .eq('user_id', user.id);
    
                if (error) {
                  console.error('Error fetching user points:', error.message);
                  return;
                }
    
                if (data.length > 0) {
                  const userScore = data[0].score;
                  setRemainingPoints(userScore);
                } else {
                  console.log('No data found for the user');
                }
              } else {
                console.log('not auth');
              }
            } catch (error) {
              console.error('Error fetching user points:', error.message);
            }
          };
    
          const fetchUsernameAndProfilePicture = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
    
              const { data, error } = await supabase
                .from('users')
                .select('email, profile')
                .eq('id', user.id)
                .single();
    
              if (error) {
                console.error('Error fetching username and profile picture1:', error.message);
                return;
              }
    
              setUsername(data.email);
              setProfilePicture(data.profile);
            } catch (error) {
              console.error('Error fetching username and profile picture:', error.message);
            }
          };
          const fetchFriends = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase.from('friendships').select('*').eq('user_id', user.id);
                if (error) {
                console.error(error);
                } else {
                console.log(data);
                setFriends(data);
                }
            }
          };
    
          fetchRemainingPoints();
          fetchUsernameAndProfilePicture();
          fetchFriends();
        }, [])
    );
    
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
            .eq('user_id', user.id); 
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

      
    useEffect(() => {
      // Fetch friends list from Supabase
      const fetchFriends = async () => {
         const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data, error } = await supabase.from('friendships').select('*').eq('user_id', user.id);
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
        <Text style={styles.friendName}>{item.friend_name}</Text>
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
          usernameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          },
          usernameText: {
            fontSize: 16,
          },
          profilePicture: {
            width: 170,
            height: 170,
            borderRadius: 100,
          },
          editProfilePictureIcon: {
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: 20,
            },      
    });

    return (
        <View style={styles.container}>
            <View style={styles.profilePictureContainer}>
            {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            ) : (
            <Text>No profile picture found</Text>
            )}

            <IconButton
                icon="pencil"
                size={25}
                color="black"
                style={styles.editProfilePictureIcon}
                onPress={() => navigation.navigate('editprofilepic')}
                />
        </View>
        <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>Welcome, {username}!</Text>
        <IconButton
          icon="pencil"
          color="black"
          size={20}
          onPress={() => navigation.navigate('editusername')}
        />
      </View>
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
    );
}