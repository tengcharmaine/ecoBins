
import React, { useEffect, useState} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const Friends = () => {
    const [friendRankings, setRankings] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [incomingFriendRequests, setIncomingFriendRequests] = useState([]);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeRankingType, setActiveRankingType] = useState('friends');
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('pending'); // New state for the active tab


    useEffect(() => {
      const fetchFriendsData = async () => {
        await fetchFriends();
        await fetchFriendRequests();
        await fetchIncomingFriendRequests();
        
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
  
    // Function to handle tab selection
  const handleTabSelection = (tab) => {
    setActiveTab(tab);
    // Perform additional logic based on the selected tab if needed
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
                rank: index + 1, // Assign a rank to each item in the rankings data
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
                rank: index + 1, // Assign a rank to each item in the rankings data
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
          console.log(request);
          console.log(user);
          const { error } = await supabase
            .from('friendships')
            .insert([{ user_id: user.id, friend_id: request.user_id, friend_name: request.user_name }, 
              { user_id: request.user_id, friend_id: user.id, friend_name: userEmail }]);
      
          if (error) {
            console.error('Error accepting friend request:', error);
          } else {
            // // Remove the accepted request from the incomingFriendRequests state
            // setIncomingFriendRequests((prevRequests) => prevRequests.filter((r) => r.id !== request.id));
            // // Add the accepted request to the acceptedRequests state
            // setAcceptedRequests((prevRequests) => [...prevRequests, request.id]);
          
              const { error } = await supabase
                .from('friendrequest')
                .delete()
                .eq('user_id', user.id);

                const { error1 } = await supabase
                .from('friendrequest')
                .delete()
                .eq('user_id', friendData.id);
          }
        } catch (error) {
          console.error('Error accepting friend request:', error);
        }
      };

      const rejectFriendRequest = async (request) => {
        try {
          const { error } = await supabase
                .from('friendrequest')
                .delete()
                .eq('user_id', user.id);

          const { error1 } = await supabase
                .from('friendrequest')
                .delete()
                .eq('user_id', request.user_id);
      
          if (error) {
            console.error('Error rejecting friend request:', error);
          } //else {
          //   // Remove the rejected request from the incomingFriendRequests state
          //   setIncomingFriendRequests((prevRequests) => prevRequests.filter((r) => r.id !== request.id));
          //   // Add the rejected request to the rejectedRequests state
          //   setRejectedRequests((prevRequests) => [...prevRequests, request.id]);
          // }
        } catch (error) {
          console.error('Error rejecting friend request:', error);
        }
      };

      const renderContent = () => {
        if (activeTab === 'pending') {
          // Render pending friend requests content
          return (
            <View>
              <Text>Pending Friend Requests</Text>
              <View>
              <FlatList
                data={friendRequests}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item.user_name}</Text>
                      {/* Add your UI components for pending friend requests */}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            </View>
          );
        } else if (activeTab === 'incoming') {
          // Render incoming friend requests content
          return (
            <View>
              <Text>Incoming Friend Requests</Text>
              <View>
              <FlatList
                data={incomingFriendRequests}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item.user_name}</Text>
                      <TouchableOpacity onPress={() => acceptFriendRequest(item)}>
                        <Image source={require('../images/check.png')} style={styles.icon} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectFriendRequest(item)}>
                        <Image source={require('../images/cross.png')} style={styles.icon} />
                      </TouchableOpacity>
                      {/* Add your UI components for pending friend requests */}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            </View>
          );
        } else {
          // Render friend list content
          return (
            <FlatList
              data={friendRankings}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleModal(item.user_name)}>
                  <View style={styles.itemContainer}>
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
            />
          );
        }
      };

return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pending' && styles.activeTabButton]}
          onPress={() => handleTabSelection('pending')}
        >
          <Text style={styles.tabButtonText}>Pending Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'incoming' && styles.activeTabButton]}
          onPress={() => handleTabSelection('incoming')}
        >
          <Text style={styles.tabButtonText}>Incoming Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friends' && styles.activeTabButton]}
          onPress={() => handleTabSelection('friends')}
        >
          <Text style={styles.tabButtonText}>Friends</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};
  
  
  const styles = StyleSheet.create({
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
        marginTop: 40
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
        marginRight: 10,
      },
      activeTabButton: {
        borderBottomColor: 'blue',
      },
      tabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
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
  
  export default Friends;
  