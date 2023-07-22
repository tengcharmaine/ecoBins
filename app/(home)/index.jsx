import { View, StyleSheet, Image, Animated, TouchableOpacity, FlatList, ImageBackground, Dimensions  } from 'react-native';
import { supabase } from '../../lib/supabase';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Linking, ActivityIndicator } from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function HomeScreen() {
    const [remainingPoints, setRemainingPoints] = useState(0);
    const [username, setUsername] = useState(null);
    const navigation = useNavigation();
    const [users, setUsers] = useState(null);
    const [userId, setUserId] = useState(null);
    const scrollAnim = useRef(new Animated.Value(0)).current;

    const [loaded] = useFonts({
      Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
      Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
      Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });

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

    const handleSettingsPress = () => {
      navigation.navigate('settings');
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

          const fetchUsername = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
          
              if (user && user.id) { // Add a check for user and user.id
                const { data, error } = await supabase
                  .from('users')
                  .select('email')
                  .eq('id', user.id)
                  .single();
          
                if (error) {
                  console.error('Error fetching username1:', error.message);
                  return;
                }
          
                setUsername(data.email);
              } else {
                console.log('User object or user.id is null');
              }
            } catch (error) {
              console.error('Error fetching username:', error.message);
            }
          };      
    
          fetchRemainingPoints();
          fetchUsername();
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
      
      <TouchableOpacity
      style={{ marginRight: 20, borderRadius: 20, overflow: 'hidden' }}
      onPress={() => Linking.openURL(item.link)}
    >
      <ImageBackground source={item.source} style={styles.backgroundImage}>
        <View style={styles.activityButton}>
          <Text style={styles.activityButtonText}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
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
            source={require('../../images/environment.png')}
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
      navigation.navigate('friends');
    };

    const handleNavigateToSubmit = () => {
      navigation.navigate('submit');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            marginTop: 90,
            justifyContent: 'center',
            //alignItems: 'center',
            //padding: 10,
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
            fontWeight: 'bold',
            fontFamily: "Poppins_Bold"
          },
          usernameText: {
            fontSize: 30,
            textAlign: 'left',
            marginLeft: 20,
            // fontWeight: 'thin'
            fontFamily: "Poppins"
          },
          friendsIcon: {
            position: 'absolute',
            top: 10,
            left: 10,
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
            settingsButton: {
              padding: 10,
              position: 'absolute',
              top: 10,
              right: 10,
            },
             activitiesHeading: {
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 20,
              marginBottom: 5,
              fontFamily: "Poppins_Bold"
            },
            activityContainer: {
              marginVertical: 10,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 30,
              height: 200,
            },
            activityButton: {
              width: 250,
              //height: 80,
              marginTop: 50,
              // borderRadius: ,
            },
            activityButtonText: {
              color: 'black',
              fontSize: 15,
              backgroundColor: "white",
              borderRadius: 100,
              paddingHorizontal: 8,
              paddingVertical: 10,
              // width: 150,
              textAlign: 'center',
              alignSelf: 'center',
              fontFamily: "Poppins"
            },
            motivationalBox: {
              flexDirection: 'row',
              alignItems: 'center',
              //justifyContent: 'center',
              backgroundColor: '#CBD6E2',
              padding: 20,
              width: '90%',
              borderRadius: 10,
              //marginTop: 20,
            },
            quoteContainer: {
              flex: 1
            },
            quoteText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              marginRight: 20,
              fontFamily: "Poppins_SemiBold"
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
              fontFamily: "Poppins_SemiBold"
            },
            pointsBottomText: {
              fontSize: 15,
              //fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
              fontFamily: "Poppins"
            },
            friendsButton: {
              flexDirection: 'column',
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
              marginBottom: 'auto',
              marginTop: 15,
              marginRight: 5,
              fontFamily: "Poppins_SemiBold"
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
              fontFamily: "Poppins_SemiBold"
            },
            recyclingText: {
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: "white",
              marginTop: 15,
              fontFamily: "Poppins_SemiBold"
            },
            submitPointsContainer: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 20,
              //marginTop: '75%',

            },
            pointsFriendsContainer: {
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            },
            friendsArrowContainer: {
              flexDirection: 'row',
              alignItems: 'center',
            },
            backgroundImage: {
              flex: 1,
              resizeMode: 'cover',
            },
            backgroundContainer: {
              flex: 1,
            },
            image: {
              width: 100,
              height: 160,
              marginBottom: 10,
              marginTop: -10,
              resizeMode: 'contain',
            },
            friendsImage: {
              width: 110,
              height: 140,
              //marginBottom: 30,
              marginTop: -10,
              resizeMode: 'contain',
            },
            scrollViewContent: {
              alignItems: 'center',
            },
            
    });

    if (!loaded) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    return (
    <View style={styles.backgroundContainer}>
      {/* <ImageBackground
          source={require('../../images/scenery2.jpg')}
          style={styles.backgroundImage}
        > */}
      <View style={styles.container}>
      <View style={{ position: 'fixed', marginBottom: 50}}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{username}!</Text>
          <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        {renderMotivationalBox()}

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
              <View style={styles.friendsArrowContainer}>
                <Text style={styles.friendsButtonText}>Find your {'\n'} friends here</Text>
                <Ionicons name="arrow-forward" size={24} color="white" style= {{marginBottom: 'auto', marginTop: 20}} />
              </View>
              <Image
                source={require('../../images/planet.png')} 
                style={styles.friendsImage}
              />
            </TouchableOpacity>
          </View>
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
      </View>
       {/* </ImageBackground> */}
      </View>
    );
}