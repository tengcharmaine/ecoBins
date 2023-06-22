import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View, Text, FlatList, Image, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [yourUserId, setYourUserId] = useState(null); 

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
        `Are you sure you want to add ${friend.user_name} to your friends?`,
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
                .from('friendships')
                .insert([
                  { user_id: user.id, friend_id: friend.user_id, friend_name: friend.user_name},
                  { user_id: friend.user_id, friend_id: user.id, friend_name: userEmail }]);
          
              if (error) {
                console.error('Error adding friend1:', error);
                return;
              }

              // Find the index of the friend in the leaderboardData
              const friendIndex = leaderboardData.findIndex(item => item.user_id === friend.user_id);
              if (friendIndex !== -1) {
                // Create a copy of the leaderboardData array
                const updatedData = [...leaderboardData];
                // Update the 'isFriendAdded' property of the friend in the copied array
                updatedData[friendIndex].isFriendAdded = true;
                // Update the leaderboardData state with the copied array
                setLeaderboardData(updatedData);
              }
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

              // Find the index of the friend in the leaderboardData
              const friendIndex = leaderboardData.findIndex(item => item.user_id === friend.user_id);
              if (friendIndex !== -1) {
                // Create a copy of the leaderboardData array
                const updatedData = [...leaderboardData];
                // Update the 'isFriendAdded' property of the friend in the copied array
                updatedData[friendIndex].isFriendAdded = false;
                // Update the leaderboardData state with the copied array
                setLeaderboardData(updatedData);
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
    fetchLeaderboardData();
  }, []);


  const fetchLeaderboardData = async () => {
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

      // Create a Set of friend IDs
      const friendIds = new Set(friendshipData.map(item => item.friend_id));

      // Add a 'rank' property to each item in the fetched data
      const rankedData = fetchedData.map((item, index) => ({
        ...item,
        rank: index + 1,
        isFriendAdded: friendIds.has(item.user_id), // Check if the friend is added
      }));

    // Use the fetched leaderboardData in your React Native component
    //   console.log(fetchedData);

      // Store the fetched leaderboardData in component state
      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.rank}</Text>
            <Image source={{ uri: item.profile }} style={styles.profilePicture} />
            <View style={styles.itemTextContainer}>
              <View style = {styles.container1}>
                <Text style={styles.itemText}>{item.user_name} {item.user_id === yourUserId && "(You)"}</Text>
                </View>
                {item.user_id !== yourUserId && (
                  item.isFriendAdded ? (
                    <TouchableOpacity onPress={() => removeFriend(item)}>
                      <Image source={require('../../images/delete-user.png')} style={styles.image} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => addFriend(item)}>
                      <Image source={require('../../images/user-add.png')} style={styles.image} />
                    </TouchableOpacity>
                  )
                )}
              </View>
              <Text style={styles.itemText1}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    height: 25,
    width: 25,
    marginRight: 30,
},
  
});

export default LeaderboardScreen;
