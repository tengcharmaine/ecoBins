import { View, StyleSheet, Image, Animated, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, Button, IconButton } from 'react-native-paper';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Friends from '../friends';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubmitScreen from './submit';

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
      <Stack.Screen name="Submit" component={SubmitScreen} />
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

    const activities = [
      { title: 'Activity 1', link: 'https://example.com/activity1' },
      { title: 'Activity 2', link: 'https://example.com/activity2' },
      { title: 'Activity 3', link: 'https://example.com/activity3' },
    ];


    const renderActivityButton = ({ item }) => (
    <RectButton
      style={styles.activityButton}
      onPress={() => Linking.openURL(item.link)}
    >
      <Text style={styles.activityButtonText}>{item.title}</Text>
    </RectButton>
  );


    const renderMotivationalBox = () => {
      return (
        <View style={styles.motivationalBox}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>
              "Your future is created by what you do today, not tomorrow."
            </Text>
          </View>
          <Image
            source={require('../../images/garden.png')}
            style={styles.motivationalImage}
          />
        </View>
      );
    };

    const renderRemainingPoints = () => {
      return (
          <View style={styles.pointsContainer}>
            <View style={styles.quoteContainer}>
              <Text style={styles.pointsText}>
                {remainingPoints} points
              </Text>
            </View>
          </View>
      );
    };

    const handleNavigateToFriends = () => {
      navigation.navigate('MyFriends');
    };

    const handleNavigateToSubmit = () => {
      navigation.navigate('Submit');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            marginTop: 60,
            //justifyContent: 'center',  
            alignItems: 'center',
            //padding: 50,
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
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            //marginTop: 10,
            marginRight: 20,
          },
          usernameText: {
            fontSize: 30,
            textAlign: 'left',
            marginRight: 5,
            fontFamily: "Optima"
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
             activitiesHeading: {
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 20,
              marginBottom: 10,
            },
            activityContainer: {
              marginVertical: 10,
              marginLeft: 20
            },
            activityButton: {
              width: 200,
              height: 200,
              backgroundColor: '#c7dede',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            },
            activityButtonText: {
              color: 'black',
              fontSize: 16,
            },
            motivationalBox: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#CBD6E2',
              padding: 20,
              width: '90%',
              borderRadius: 10,
              marginTop: 20,
            },
            quoteContainer: {
              flex: 1
            },
            quoteText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginRight: 20,
            },
            motivationalImage: {
              width: 100,
              height: 100,
              resizeMode: 'contain',
            },    
            pointsContainer: {
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#CBD6E2',
              borderRadius: 10,
              height: 40,
              marginBottom: 20
            },
            pointsText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            },
            friendsButton: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#CBD6E2',
              width: '100%',
              height: 190,
              borderRadius: 10,
            },
            friendsButtonText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            },
            submitButton: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#CBD6E2',
              width: '40%',
              borderRadius: 10,
              marginRight: 30,
              height: 250
            },
            submitButtonText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            },
            submitPointsContainer: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 20,

            },
            pointsFriendsContainer: {
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            },

    });

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

      <View style={styles.container}>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>Welcome,</Text>
        </View>
        <Text style={styles.usernameText}>{username}!</Text>
        {renderMotivationalBox()}

      <View style={styles.submitPointsContainer}>
          <TouchableOpacity onPress={handleNavigateToSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.pointsFriendsContainer}>
          {renderRemainingPoints()}
            <TouchableOpacity onPress={handleNavigateToFriends} style={styles.friendsButton}>
              <Text style={styles.friendsButtonText}>Friends</Text>
            </TouchableOpacity>
          </View>
      </View>
          
        {/* settings icon */}
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
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activitiesHeading}>Activities</Text>
          <FlatList
            data={activities}
            renderItem={renderActivityButton}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

      </ScrollView>
    );
}

export default FriendsStack;