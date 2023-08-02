import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Button } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Modal from 'react-native-modal';
import { useFonts } from 'expo-font';

export default LeaderboardScreen = () => {
  const navigation = useNavigation();

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [yourUserId, setYourUserId] = useState(null); 
  const [selectedUserName, setSelectedUserName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeRankingType, setActiveRankingType] = useState('global');
  const [isLoading, setIsLoading] = useState(false); 
  const [friendRankings, setRankings] = useState([]);
  const [refreshing, setRefreshing] = useState(false); 

  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
    Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const addFriend = async (friend) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
     
      const { data: userData, error: userTableError } = await supabase
        .from('users')
        .select('email')
        .eq('id', user.id)
        .single();

      const userEmail = userData.email;  
      // Prompt the user for confirmation
      Alert.alert(
        'Add Friend',
        `Are you sure you want to send ${friend.user_name} a friend request?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Add',
            style: 'default',
            onPress: async () => {
              const { data, error } = await supabase
                .from('friendrequest')
                .insert([{ user_id: user.id, friend_id: friend.user_id, status: 'pending' },
                { user_id: friend.user_id, friend_id: user.id, status: 'incoming' }] );
            
            },
          },
        ],
        { cancelable: false });
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const removeFriend = async (friend) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Prompt the user for confirmation
      Alert.alert(
        'Remove Friend',
        `Are you sure you want to remove ${friend.user_name} from your friends?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              const {error } = await supabase
                .from('friendships')
                .delete()
                .match({ user_id: user.id, friend_id: friend.user_id});

                const { error: error2 } = await supabase
                  .from('friendships')
                  .delete()
                  .match({ user_id: friend.user_id, friend_id: user.id });

              if (error || error2) {
                console.error('Error removing friend:', error);
                return;
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };
  
  useEffect(() => {
    setActiveRankingType('global');
    fetchLeaderboardData();
    fetchFriends();
  }, []);

  const handleFriendshipChange = (payload) => {
    const updatedFriendId = payload.new.friend_id;
    setLeaderboardData((prevData) =>
      prevData.map((item) => {
        if (item.user_id === updatedFriendId) {
          return {
            ...item,
            isFriendAdded: true,
          };
        }
        return item;
      })
    );
  };



  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const { data: {user} } = await supabase.auth.getUser();
      setYourUserId(user.id);

      const { data: fetchedData, error } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard data:', error);
        return;
      }
      // Fetch friendship data from the 'friendships' table
      const { data: friendshipData, error: friendshipError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id);

      if (friendshipError) {
        console.error('Error fetching friendship data:', friendshipError);
        return;
      }

      const { data: pendingData, error: pendingError } = await supabase
        .from('friendrequest')
        .select('friend_id')
        .eq('user_id', user.id);

      if (pendingError) {
        console.error('Error fetching pending friends data:', pendingError);
        return;
      }

      // Create a Set of friend IDs
      const friendIds = new Set(friendshipData.map(item => item.friend_id));

      // Create a Set of friend IDs
      const pendingIds = new Set(pendingData.map(item => item.friend_id));

      // Add a 'rank' property to each item in the fetched data
      const rankedData = fetchedData.map((item, index) => ({
        ...item,
        rank: index + 1,
        isFriendAdded: friendIds.has(item.user_id), // Check if the friend is added
        isFriendPending: pendingIds.has(item.user_id)
      }));

      // Store the fetched leaderboardData in component state
      setLeaderboardData(rankedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setIsLoading(false);
    }
  };
  
  const reloadScreen = useCallback(() => {
    fetchLeaderboardData();
    setActiveRankingType('global');
    fetchFriends();
  }, []);

  const onRefresh = async () => {
    await fetchLeaderboardData();
    await fetchFriends();
  };


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
            rank: index + 1,
          })));
        }
      }
    }
  };

  useFocusEffect(reloadScreen); 

  const toggleModal = (userName) => {
    setSelectedUserName(userName);
    setIsModalVisible(!isModalVisible);
  };

  const renderUsername = (userName) => {
    if (userName.length > 7) {
      return `${userName.substring(0, 7)}...`;
    }
    return userName;
  };

  const handleTabSelection = (tab) => {
    setActiveRankingType(tab);
  };

  const renderTabs = () => {
    const tabs = [
      { key: 'global', label: 'Global' },
      { key: 'friends', label: 'Friends' },
    ];

    return tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabButton,
          activeRankingType === tab.key && styles.activeTabButton,
        ]}
        onPress={() => handleTabSelection(tab.key)}
      >
        <Text style={styles.tabButtonText}>{tab.label}</Text>
      </TouchableOpacity>
    ));
  };

  const renderContent = () => {
    if (activeRankingType == 'global') {
      return (
        <View>
          
<FlatList
        data={leaderboardData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.rank}</Text>
            <Image source={{ uri: item.profile }} style={styles.profilePicture} />
            <View style={styles.itemTextContainer}>
              <View style={styles.container1}>
                <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                  <Text style={styles.itemText}>{renderUsername(item.user_name)} {item.user_id === yourUserId && "(You)"}</Text>
                </TouchableOpacity>
              </View>
              {item.user_id !== yourUserId && (
                item.isFriendAdded ? (
                  <TouchableOpacity onPress={() => removeFriend(item)}>
                    <Image source={require('../../images/delete-user.png')} style={styles.image} />
                  </TouchableOpacity>
                ) : (
                item.isFriendPending ? (
                    // Change the icon for the friend request when it's pending
                    <Image source={require('../../images/wall-clock.png')} style={styles.image} />
                  ) : (
                    <TouchableOpacity onPress={() => addFriend(item)}>
                      <Image source={require('../../images/user-add.png')} style={styles.image} />
                    </TouchableOpacity>
                  )
                ))
              }
            </View>
            <Text style={styles.itemText1}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
      );
    } else {
      return (
        <View>
          <FlatList
            data={friendRankings}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.rank}</Text>
                <Image source={{ uri: item.profile }} style={styles.profilePicture} />
                <View style={styles.itemTextContainer}>
                  <View style={styles.container1}>
                    <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                      <Text style={styles.itemText}>{renderUsername(item.user_name)}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.itemText1}>{item.score}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
          />
          <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
              <Button title="Close" onPress={toggleModal} />
            </View>
          </Modal>
        </View>
      );
    }
  }

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.tabContainer}>{renderTabs()}</View>
        <View style={styles.contentContainer}>{renderContent()}</View>
    </View> 
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginTop: 5,

  },
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
    marginTop: 50,
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
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'lightgray',
  },
  activeTabButton: {
    borderBottomColor: 'blue',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "Poppins_SemiBold"
  },
});

