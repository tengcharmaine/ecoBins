import { View, StyleSheet, Image, Animated, TouchableOpacity, FlatList, ImageBackground, Dimensions  } from 'react-native';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, Button, } from 'react-native-paper';
import { Link } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Friends from '../friends';
import { Linking } from 'react-native';
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
    const scrollAnim = useRef(new Animated.Value(0)).current;

    const windowHeight = Dimensions.get('window').height;

    // Calculate the interpolated font size based on scroll position
    const fontSizeInterpolation = scrollAnim.interpolate({
      inputRange: [0, windowHeight / 2], // Adjust the range as needed
      outputRange: [20, 50], // Adjust the font sizes as needed
      extrapolate: 'clamp',
    });

    // Calculate the interpolated font size based on scroll position
    const userFontSizeInterpolation = scrollAnim.interpolate({
      inputRange: [0, windowHeight / 2], // Adjust the range as needed
      outputRange: [20, 50], // Adjust the font sizes as needed
      extrapolate: 'clamp',
    });

    // Calculate the interpolated margin top based on scroll position
    const marginTopInterpolation = scrollAnim.interpolate({
      inputRange: [0, windowHeight / 3 ], // Adjust the range as needed
      outputRange: [0, 250], // Adjust the margins as needed
      extrapolate: 'clamp',
    });

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
      { title: 'Join as a volunteer', link: 'https://www.nparks.gov.sg/partner-us/volunteer', source: require('../../images/volunteer.avif') },
      { title: 'Latest eco-events', link: 'https://secondsguru.com/calendar/', source: require('../../images/events.jpg') },
      { title: 'One million trees movement', link: 'https://www.nparks.gov.sg/treessg/one-million-trees-movement', source: require('../../images/trees.jpg') },
      
    ];


    const renderActivityButton = ({ item }) => (
      <ImageBackground source={item.source} style={styles.backgroundImage
      && { marginRight: 20, borderRadius: 20, overflow: "hidden"}}>
        <TouchableOpacity
          style={styles.activityButton}
          onPress={() => Linking.openURL(item.link)}
        >
          
            <Text style={styles.activityButtonText}>{item.title}</Text>
          
        </TouchableOpacity>
      </ImageBackground>
  
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
              <Text style={styles.pointsBottomText}>
                accumulated so far
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
            marginTop: 70,
            //justifyContent: 'center',  
            //alignItems: 'center',
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
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            //marginTop: 10,
            marginRight: 20,
          },
          welcomeText: {
            fontSize: 50,
            textAlign: 'left',
            marginLeft: 20,
            fontFamily: "Optima"
          },
          usernameText: {
            fontSize: 30,
            textAlign: 'left',
            marginLeft: 20,
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
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 30
            },
            activityButton: {
              width: 250,
              height: 200,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            },
            activityButtonText: {
              color: 'black',
              fontSize: 16,
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 4,
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
              backgroundColor: '#355C7D',
              borderRadius: 10,
              height: 60,
              marginBottom: 20
            },
            pointsText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
            },
            pointsBottomText: {
              fontSize: 15,
              //fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 5,
              color: "white",
            },
            friendsButton: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#355C7D',
              width: '100%',
              height: 190,
              borderRadius: 10,
            },
            friendsButtonText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
              marginTop: 'auto',
            },
            submitButton: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#355C7D',
              width: '40%',
              borderRadius: 10,
              marginRight: 30,
              height: 270
            },
            submitButtonText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
              marginTop: 'auto',
            },
            recyclingText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
              marginTop: 10
            },
            submitPointsContainer: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 20,
              marginTop: '75%',

            },
            pointsFriendsContainer: {
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            },
            backgroundImage: {
              flex: 1,
              resizeMode: 'cover', // Optional: Adjust the image resize mode as needed
            },
            backgroundContainer: {
              flex: 1,
            },
            image: {
              width: 80,
              height: 150,
              marginBottom: 10,
              resizeMode: 'contain',
            },
            
    });

    return (
    <View style={styles.backgroundContainer}>
      <ImageBackground
          source={require('../../images/scenery2.jpg')}
          style={styles.backgroundImage}
        >
      <Animated.ScrollView contentContainerStyle={styles.scrollViewContent}
       onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnim } } }], { useNativeDriver: true})}
       scrollEventThrottle={16}>
        
      <View style={styles.container}>
        {/* <View style={styles.usernameContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
        </View> */}
        <Animated.View style={[
          styles.usernameContainer,
          { transform: [{ translateY: marginTopInterpolation }] },
        ]}>
              <Animated.Text style={[
                styles.welcomeText,
                { transform: [{ translateY: fontSizeInterpolation }] },
              ]}>
              Welcome,
              </Animated.Text>
              <Animated.Text style={[
                styles.usernameText,
                { transform: [{ translateY: userFontSizeInterpolation }] },
              ]}> 
              {username}!
              </Animated.Text>
        </Animated.View>
        
        {/* {renderMotivationalBox()} */}

      <View style={styles.submitPointsContainer}>
          <TouchableOpacity onPress={handleNavigateToSubmit} style={styles.submitButton}>
            <Text style={styles.recyclingText}>Recycling an item?</Text>
            <Image source={require('../../images/repurpose.png')} style={styles.image} />
            <Text style={styles.submitButtonText}>Submit here</Text>
            <Ionicons name="arrow-forward" size={24} color="white" style= {{marginBottom: 10}} />
          </TouchableOpacity>
          <View style={styles.pointsFriendsContainer}>
          {renderRemainingPoints()}
            <TouchableOpacity onPress={handleNavigateToFriends} style={styles.friendsButton}>
              <Text style={styles.friendsButtonText}>My friends</Text>
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
     
      </Animated.ScrollView>
       </ImageBackground>
      </View>
    );
}

export default FriendsStack;