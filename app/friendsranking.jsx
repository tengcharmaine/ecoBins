import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const FriendRankingsScreen = () => {
    const [friendRankings, setRankings] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
      const fetchFriendsData = async () => {
        await fetchFriends();
      };
  
      fetchFriendsData();
  
      // Fetch data every time the screen is focused
      const unsubscribe = navigation.addListener('focus', fetchFriendsData);
  
      return unsubscribe;
    }, []);

    const fetchFriends = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: friends, error } = await supabase
            .from('friendships')
            .select('friend_id')
            .eq('user_id', user.id);
      
          if (error) {
            console.error(error);
          } else {
            const friendIds = friends.map((friend) => friend.friend_id);
      
            const { data: rankingsData, error: rankingsError } = await supabase
              .from('ranking')
              .select('profile, user_name, score')
              .in('user_id', friendIds)
              .order('score', { ascending: false });
      
            if (rankingsError) {
              console.error(rankingsError);
            } else {
              console.log(rankingsData);
              // Update state with the rankings data
              setRankings(rankingsData.map((item, index) => ({
                ...item,
                rank: index + 1, // Assign a rank to each item in the rankings data
              })));
            }
          }
        }
      };
      
      const navigateToRankings = () => {
        navigation.navigate('leaderBoard');
      };
  
      const toggleModal = (userName) => {
        setSelectedUserName(userName);
        setIsModalVisible(!isModalVisible);
      };
    
      const renderUsername = (userName) => {
        if (userName.length > 8) {
          return `${userName.substring(0, 8)}...`;
        }
        return userName;
      };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Friend Rankings</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={navigateToRankings}>
          <Text style={styles.buttonText}>View Global Rankings</Text>
        </TouchableOpacity>
      <FlatList
          data={friendRankings}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.rank}</Text>
            <Image source={{ uri: item.profile }} style={styles.profilePicture} />
            <View style={styles.itemTextContainer}>
              <View style = {styles.container1}>
                <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                  <Text style={styles.itemText}>{renderUsername(item.user_name)}</Text>
                </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemText1}>{item.score}</Text>
          </View>
          )}
      />
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    buttonContainer: {
        flex: 0,
      },
      container1: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
      },
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 80,
        width: 350,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        // borderTopLeftRadius: 20,
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20,
        marginBottom: 10,
      },
      itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        justifyContent: 'center',
        marginLeft: 30,
      },
      itemText1: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 30,
      },
      itemTextContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between', // Aligns items vertically
        flexDirection: 'row', // Aligns items horizontally
        alignItems: 'center', // Centers items vertically
      },
      profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 20,
      },
      title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        justifyContent: 'center',
      },
      addButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      },
      buttonText: {
        color: 'grey',
        fontWeight: 'bold',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
      },
      image: {
        height: 25,
        width: 25,
        marginRight: 30,
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 10,
    },  
  });
  
  export default FriendRankingsScreen;
  