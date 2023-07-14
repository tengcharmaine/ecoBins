import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

function ProfileSection({ profilePicture, username }) {
  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 30,
      alignItems: 'center',
      marginBottom: 80,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    usernameText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.sectionContainer}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <Text>No profile picture found</Text>
      )}
      <Text style={styles.usernameText}>{username}</Text>
    </View>
  );
}

function SectionHeader({ title, iconName }) {
  const styles = StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    sectionHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color="black" />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUsernameAndProfilePicture = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();

          if (user && user.id) {
            const { data, error } = await supabase
              .from('users')
              .select('email, profile')
              .eq('id', user.id)
              .single();

            if (error) {
              console.error('Error fetching username and profile picture:', error.message);
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

      fetchUsernameAndProfilePicture();
    }, [])
  );

  const handleGoBack = () => {
    navigation.navigate('index');
  };

  const handleEditProfilePicture = () => {
    navigation.navigate('editprofilepic');
  };

  const handleEditUsername = () => {
    navigation.navigate('editusername');
  };
  
  const handleChangePassword = () => {
    navigation.navigate('PasswordUpdate');
  };

  const handleaboutus = () => {

  };

  const handletutorial = () => {

  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      marginTop: 30,
    },
    backButton: {
      padding: 10,
      borderRadius: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: -20,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    sectionContainer: {
      marginBottom: 20,
    },
    logoutButton: {
      backgroundColor: '#c7dede',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    logoutButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    profilepicturecontainer: {
      marginTop: -35,
      marginBottom: -65,
    },
    editButtonContainer: {
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'space-between'
    },
    editButton: {
      backgroundColor: '#FFF',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#DDD',
      marginBottom: 10,
      alignItems: 'center',
      flexDirection: 'row',
      width: 350,
    },
    editText: {
      fontSize: 14,
    //   fontWeight: 'bold',
      color: 'black',
      marginRight: 10,
    },
    arrowIcon: {
      marginLeft: 'auto',
      padding: 5
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <View style={styles.content}>
        <View style={styles.profilepicturecontainer}>
          <ProfileSection profilePicture={profilePicture} username={username} />
        </View>
        <ScrollView>
        <View style={styles.sectionContainer}>
          <SectionHeader title="Profile" iconName="person-outline" />
          <View style={styles.editButtonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditUsername}>
              <Text style={styles.editText}>Edit Username</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfilePicture}>
              <Text style={styles.editText}>Edit Profile Picture</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <SectionHeader title="Security and Privacy" iconName="shield-checkmark-outline" />
          <View style={styles.editButtonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleChangePassword}>
              <Text style={styles.editText}>Change password</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>        
        </View>
        <View style={styles.sectionContainer}>
          <SectionHeader title="About" iconName="information-circle-outline" />
          <View style={styles.editButtonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handletutorial}>
              <Text style={styles.editText}>Tutorial</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleaboutus}>
              <Text style={styles.editText}>About us</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          </View>
        <Button mode="contained" style={styles.logoutButton} onPress={() => navigation.navigate('Logout')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Button>
        </ScrollView>        
      </View>
    </View>
  );
}

export default SettingsScreen;
