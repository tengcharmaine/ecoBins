import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const Friends = () => {
  const [friendRankings, setRankings] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('friends');
  const [yourUserId, setYourUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [isPendingRequestsLoaded, setIsPendingRequestsLoaded] = useState(false);
  const [isIncomingRequestsLoaded, setIsIncomingRequestsLoaded] = useState(false);
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Poppins_SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchFriendsData();
    setIsRefreshing(false);
  };

  // Function to handle manual pull-to-refresh action
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchFriendsData();
    setIsRefreshing(false);
  };

  const fetchFriendsData = async () => {
    await fetchFriends();
    await fetchFriendRequests();
    await fetchIncomingFriendRequests();
  };

  useEffect(() => {
    if (isFocused) {
      fetchFriendsData();
      fetchFriendRequests();
    }
  }, [isFocused]);

  useEffect(() => {
    if (activeTab === 'incoming' && !isIncomingRequestsLoaded) {
      fetchIncomingFriendRequests();
      setIsIncomingRequestsLoaded(true);
    }
  }, [activeTab, isIncomingRequestsLoaded]);

  useEffect(() => {
    if (activeTab === 'pending' && !isPendingRequestsLoaded) {
      fetchFriendRequests();
      setIsPendingRequestsLoaded(true);
    }
  }, [activeTab, isPendingRequestsLoaded]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredFriendRankings = friendRankings.filter(
    (friend) =>
      friend.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchFriends = async () => {
    try {
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

      // Create a Set of pending friend IDs
      const pendingIds = new Set(pendingData.map(item => item.friend_id));

      // Add a 'rank' property to each item in the fetched data
      const rankedData = fetchedData.map((item, index) => ({
        ...item,
        rank: index + 1,
        isFriendAdded: friendIds.has(item.user_id),
        isFriendPending: pendingIds.has(item.user_id)
      }));

      // Store the fetched leaderboardData in component state
      setRankings(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };
  
  const addFriend = async (friend) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
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
                { user_id: friend.user_id, friend_id: user.id, status: 'incoming' }]);
                
              if (error) {
                console.error('Error adding friend:', error);
                return;
              }
  
              // Update the friend object in the rankings data to indicate that the friend request is pending
              setRankings((prevData) =>
                prevData.map((item) => {
                  if (item.user_id === friend.user_id) {
                    return {
                      ...item,
                      isFriendAdded: false,
                      isFriendPending: true,
                    };
                  }
                  console.log(item);
                  console.log(item.isFriendPending);
                  return item;
                })
              );
              onRefresh();
            },
          },
        ],
        { cancelable: false }
      );
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
              onRefresh();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  // Function to handle tab selection
  const handleTabSelection = (tab) => {
    setActiveTab(tab);
    onRefresh();
  };

  const fetchFriendRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: friendRequestsData, error } = await supabase
        .from('friendrequest')
        .select('user_id, friend_id')
        .eq('status', 'pending')
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else {
        const friendIds = friendRequestsData.map((friend) => friend.friend_id);

        const { data: requestData, error: requestError } = await supabase
          .from('ranking')
          .select('profile, user_name, score, user_id')
          .in('user_id', friendIds)
          .order('score', { ascending: false });

        if (requestError) {
          console.error(requestError);
        } else {
          console.log(requestData);
          // Update state with the rankings data
          setFriendRequests(requestData.map((item, index) => ({
            ...item,
            rank: index + 1,
          })));
          console.log(friendRequests);
        }
      }
    }
  };

  const fetchIncomingFriendRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: incomingFriendRequestsData, error } = await supabase
        .from('friendrequest')
        .select('user_id, friend_id')
        .eq('status', 'incoming')
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else {
        const friendIds = incomingFriendRequestsData.map((friend) => friend.friend_id);

        const { data: requestData, error: requestError } = await supabase
          .from('ranking')
          .select('profile, user_name, score, user_id')
          .in('user_id', friendIds)
          .order('score', { ascending: false });

        if (requestError) {
          console.error(requestError);
        } else {
          console.log(requestData);
          // Update state with the rankings data
          setIncomingFriendRequests(requestData.map((item, index) => ({
            ...item,
            rank: index + 1,
          })));
          console.log(incomingFriendRequests);
        }
      }
    }
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

          const acceptFriendRequest = async (request) => {
            const { data: { user } } = await supabase.auth.getUser();
          
            const { data: userData, error: userTableError } = await supabase
              .from('users')
              .select('email')
              .eq('id', user.id)
              .single();
          
            const userEmail = userData.email;
          
            try {
              const { error } = await supabase
                .from('friendships')
                .insert([{ user_id: user.id, friend_id: request.user_id, friend_name: request.user_name }, 
                  { user_id: request.user_id, friend_id: user.id, friend_name: userEmail }]);
          
              if (error) {
                console.error('Error accepting friend request:', error);
              } else {
                setIncomingFriendRequests((prevRequests) => prevRequests.filter((r) => r.id !== request.id));

            // Add the accepted request to the acceptedRequests state
            setAcceptedRequests((prevRequests) => [...prevRequests, request.id]);

            // Update the friend object in the rankings data to indicate that the friend request has been accepted
            setRankings((prevData) =>
              prevData.map((item) => {
                if (item.user_id === request.user_id) {
                  return {
                    ...item,
                    isFriendAdded: true,
                    isFriendPending: false,
                  };
                }
                console.log(item);
                  console.log(item.isFriendPending);
                return item;
              })
            );
              }
              const { error2 } = await supabase
                    .from('friendrequest')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('friend_id', request.user_id);

              console.log(request);
                    const { error1 } = await supabase
                    .from('friendrequest')
                    .delete()
                    .eq('user_id', request.user_id)
                    .eq('friend_id', user.id);

          } catch (error) {
            console.error('Error accepting friend request:', error);
          }
          onRefresh()
        };     
    
          const rejectFriendRequest = async (request) => {
            try {
              const { error } = await supabase
                    .from('friendrequest')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('friend_id', request.user_id);;
    
              const { error1 } = await supabase
                    .from('friendrequest')
                    .delete()
                    .eq('user_id', request.user_id)
                    .eq('friend_id', user.id);
          
              if (error) {
                console.error('Error rejecting friend request:', error);
              } 
            } catch (error) {
              console.error('Error rejecting friend request:', error);
            }
            onRefresh()
          };
    
          const renderUsername1 = (userName) => {
            if (userName.length > 20) {
              return `${userName.substring(0, 20)}...`;
            }
            return userName;
          };
    
          const renderUsername2 = (userName) => {
            if (userName.length > 12) {
              return `${userName.substring(0, 12)}...`;
            }
            return userName;
          };
    
          const renderContent = () => {
            if (activeTab === 'pending') {
              // Render pending friend requests content
              return (
                <View>
          <Text style={styles.smallheader}>Pending Friend Requests</Text>
                  <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.profile }} style={styles.profilePicture} />
                <View style={styles.textContainer}>
                  <Text style={styles.itemText}>{renderUsername1(item.user_name)}</Text>
                </View>
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
                    <Button title="Close" onPress={toggleModal} />
                  </View>
                </Modal>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    );
            } else if (activeTab === 'incoming') {
              // Render incoming friend requests content
              return (
                <View>
          <Text style={styles.smallheader}>Incoming Friend Requests</Text>
        <FlatList
          data={incomingFriendRequests}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.profile }} style={styles.profilePicture} />
                <View style={styles.textContainer1}>
                  <Text style={styles.itemText}>{renderUsername2(item.user_name)}</Text>
                </View>
                <TouchableOpacity onPress={() => acceptFriendRequest(item)}>
                  <Image source={require('../images/check.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectFriendRequest(item)}>
                  <Image source={require('../images/cross.png')} style={styles.icon} />
                </TouchableOpacity>
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
                    <Button title="Close" onPress={toggleModal} />
                  </View>
                </Modal>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    );
            } else {
              // Render friend list content
              return (
                <View>
                  <TextInput
            style={styles.searchInput}
            placeholder="Search username..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
                <FlatList
                  data={filteredFriendRankings}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                      <View style={styles.itemContainer}>
                            <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>{item.rank}</Text>
                            <Image source={{ uri: item.profile }} style={styles.profilePicture} />
                            <View style={styles.itemTextContainer}>
                            <View style = {styles.container1}>
                                <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                                <Text style={styles.itemText}>{renderUsername(item.user_name)} {item.user_id === yourUserId && "(You)"}</Text>
                                </TouchableOpacity>
                                </View>
                                {item.user_id !== yourUserId && (
                                item.isFriendAdded ? (
                                <TouchableOpacity onPress={() => removeFriend(item)}>
                                  <Image source={require('../images/delete-user.png')} style={styles.image} />
                                </TouchableOpacity>
                              ) : (
                        item.isFriendPending ? (
                           // Change the icon for the friend request when it's pending
                           <Image source={require('../images/wall-clock.png')} style={styles.image} />
                         ) : (
                           <TouchableOpacity onPress={() => addFriend(item)}>
                             <Image source={require('../images/user-add.png')} style={styles.image} />
                           </TouchableOpacity>
                  )
                  )
               )}
                            </View>
                        </View>
                        
                    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{selectedUserName ? selectedUserName.toString() : ''}</Text>
                        <Button title="Close" onPress={toggleModal} />
                        </View>
                    </Modal>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.rank.toString()}
                  refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                  }
                />
                </View>
              );
            }
          };

  const renderTabs = () => {
    const tabs = [
      { key: 'friends', label: 'Find Friends' },
      { key: 'pending', label: 'Pending Requests' },
      { key: 'incoming', label: 'Incoming Requests' },
    ];

    return tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tabButton,
          activeTab === tab.key && styles.activeTabButton,
        ]}
        onPress={() => handleTabSelection(tab.key)}
      >
        <Text style={styles.tabButtonText}>{tab.label}</Text>
      </TouchableOpacity>
    ));
  };

  const goBack = () => {
    navigation.navigate('index');
  };

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Friends</Text>
      <View style={styles.tabContainer}>{renderTabs()}</View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  refreshButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
    searchInput: {
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1,
      backgroundColor: 'white',
      fontSize: 16,
      fontFamily: "Poppins"
    },
        smallheader: {
          fontSize: 15,
          marginBottom: 5,
          fontFamily: "Poppins"
        },
        textContainer: {
          flex: 1,
          justifyContent: 'center',
          marginLeft: 10,
        },
        textContainer1: {
          flex: 1,
          justifyContent: 'center',
        },
        backButton: {
          position: 'absolute',
          top: 60,
          left: 20,
          zIndex: 1,
        },
        buttonContainer: {
          flex: 0,
          flexDirection: 'row',
          marginBottom: 15,
        },
        contentContainer: {
            flex: 1,
            marginTop: 5,
    
          },
        tabContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            marginTop: 10
          },
          tabButton: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderBottomColor: 'lightgray',
          },
          icon: {
            width: 24,
            height: 24,
            marginLeft: 10,
            marginRight: 21,
          },
          activeTabButton: {
            borderBottomColor: 'blue',
          },
          tabButtonText: {
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: "Poppins_SemiBold"
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
          backgroundColor: '#29AB87',
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
            justifyContent: 'flex-start',
            padding: 20,
            marginTop: 10
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
            top: 5
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
            justifyContent: 'center',
            marginTop: 35,
            fontFamily: "Poppins_Bold"
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

export default Friends;
