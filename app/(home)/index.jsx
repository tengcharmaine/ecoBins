import { View, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, Button, IconButton } from 'react-native-paper';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Friends from '../friends';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const FriendsStack = () => {
  return (
    
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor : '#c7dede',},
        headerShown: false
    }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyFriends" component={Friends} />
    </Stack.Navigator>
    
  );
};

function HomeScreen() {
    const [remainingPoints, setRemainingPoints] = useState(0);
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigation = useNavigation();
    const [users, setUsers] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsAnim = useRef(new Animated.Value(-300)).current;

    const SettingsScreen = ({ onClose }) => {
      const handleResetPassword = async () => {
        navigation.navigate('PasswordUpdate');
      };
  
      const handleGoBack = () => {
        onClose();
      };
  
      return (
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.buttonContainer}>
            <Button style={styles.button1} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </Button>
            <Button style={styles.button1}>
              <Link style={styles.buttonText} href="/Logout">
                Logout
              </Link>
            </Button>
          </View>
          <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    };
  
    const handleSettingsPress = () => {
      setIsSettingsOpen(true);
      Animated.spring(settingsAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    };
  
    const handleCloseSettings = () => {
      Animated.spring(settingsAnim, {
        toValue: -300,
        useNativeDriver: false,
      }).start(() => {
        setIsSettingsOpen(false);
      });
    };

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
          
              if (user && user.id) { // Add a check for user and user.id
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
              } else {
                console.log('User object or user.id is null');
              }
            } catch (error) {
              console.error('Error fetching username and profile picture:', error.message);
            }
          };      
    
          fetchRemainingPoints();
          fetchUsernameAndProfilePicture();
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

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: 'center',  
            alignItems: 'center',
            padding: 50,
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
        button1: {
          borderColor: "black",
          alignItems: 'center',
          backgroundColor: "#c7dede",
          width: '60%',
          marginTop: 20,
          marginBottom: 10,
          borderRadius: 10,
      },
      buttonText: {
        color: 'black'
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
          usernameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          },
          usernameText: {
            fontSize: 16,
          },
          friendsIcon: {
            position: 'absolute',
            top: 10,
            left: 10,
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
            settingsContainer: {
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '150%',
              backgroundColor: '#fff',
              padding: 20,
              elevation: 4,
              zIndex: 999,
            },
            settingsTitle: {
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 20,
            },
            buttonContainer: {
              flex: 1,
              // justifyContent: 'center',
            },
            closeButton: {
              position: 'absolute',
              top: 10,
              right: 10,
            },
            settingsButtonWrapper: {
              position: 'absolute',
              top: 10,
              right: 10,
            },
            settingsButton: {
              padding: 10,
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
            <View style={styles.settingsButtonWrapper}>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {isSettingsOpen && (
        <Animated.View style={[styles.settingsContainer, { right: settingsAnim }]}>
          <SettingsScreen onClose={handleCloseSettings} />
        </Animated.View>
      )}
    {/* </View> */}
            <Ionicons
              name="people-outline"
              size={25}
              color="black"
              style={styles.friendsIcon}
              onPress={() => navigation.navigate('friends')}
            />
        </View>
    );
}

export default FriendsStack;