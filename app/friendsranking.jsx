import React, { useEffect, useState} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useFonts } from 'expo-font';

const FriendRankingsScreen = () => {
    const [friendRankings, setRankings] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeRankingType, setActiveRankingType] = useState('friends');
    const navigation = useNavigation();

    useEffect(() => {
      const fetchFriendsData = async () => {
        await fetchFriends();
      };
  
      fetchFriendsData();
  
      // Fetch data every time the screen is focused
      const unsubscribe = navigation.addListener('focus', fetchFriendsData);
  
      setActiveRankingType('friends');

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
      
      const navigateToGlobalRanking = () => {
        setActiveRankingType('global');
        navigation.goBack();
      };
    
      const navigateToFriendsRanking = () => {
        setActiveRankingType('friends');
        navigation.navigate('friendsRanking');
      };
  
      const toggleModal = (userName) => {
        setSelectedUserName(userName);
        setIsModalVisible(!isModalVisible);
      };
    
      const renderUsername = (userName) => {
        if (userName.length > 10) {
          return `${userName.substring(0, 10)}...`;
        }
        return userName;
      };

      const [loaded] = useFonts({
        Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
        Poppins_Bold: require('../assets/fonts/Poppins-Bold.ttf'),
        Poppins_SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
      });

      if (!loaded) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Friend Rankings</Text>
        <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[
        styles.button,
        activeRankingType === 'global' && styles.activeButton,
      ]}
      onPress={navigateToGlobalRanking}
    >
      <Text style={styles.buttonText}>Global</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.button,
        activeRankingType === 'friends' && styles.activeButton,
      ]}
      onPress={navigateToFriendsRanking}
    >
      <Text style={styles.buttonText}>Friends</Text>
    </TouchableOpacity>
  </View>
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
      flexDirection: 'row',
      marginBottom: 15,
    },
    button: {
      marginRight: 10,
      marginLeft: 10,
      width: 150,
      height: 50,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 10,
    },
    activeButton: {
      backgroundColor: '#CBD6E2',
      borderRadius: 10,
    },
      container1: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
      },
      container: {
        marginTop: 50,
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
        marginBottom: 10,
      },
      itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        justifyContent: 'center',
        marginLeft: 30,
        fontFamily: "Poppins_SemiBold"
      },
      itemText1: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 30,
        fontFamily: "Poppins_SemiBold"
      },
      itemTextContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'space-between',
        flexDirection: 'row', 
        alignItems: 'center', 
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
        fontFamily: "Poppins_Bold"
      },
      addButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
      },
      buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        marginTop: 15,
        fontFamily: "Poppins_SemiBold"
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
      fontFamily: "Poppins"
    },  
  });
  
  export default FriendRankingsScreen;
  