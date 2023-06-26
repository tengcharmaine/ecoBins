import { View, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import React, { useEffect, useState, useCallback, Component } from 'react';
import { Text, Button, IconButton } from 'react-native-paper';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          remainingPoints: 0,
          username: null,
          profilePicture: null
        };
      }

    fetchRemainingPoints = async () => {
        const { remainingPoints } = this.state;
        this.setState({
          remainingPoints: 0
        });

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
                  this.setState({ remainingPoints: userScore });
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

    fetchUsernameAndProfilePicture = async () => {
        const { username, profilePicture } = this.state;
        this.setState({
          username: null,
          profilePicture: null
        });
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
          
                this.setState({ username: data.email });
                this.setState({ profilePicture: data.profile });

              } else {
                console.log('User object or user.id is null');
              }
            } catch (error) {
              console.error('Error fetching username and profile picture:', error.message);
            }
    };          
      
    render() {
        const { remainingPoints, username, profilePicture } = this.state;

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
            <Button style = {styles.button}>Logout
            </Button>
        </View>
    );
            }
        }