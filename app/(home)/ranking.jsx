import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const supabaseUrl = 'https://modwjtelabjhmmhchteg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZHdqdGVsYWJqaG1taGNodGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NTQ5NzEsImV4cCI6MjAwMDQzMDk3MX0.ttr3X3C5CvZ0Wyrgync08D76JK9du5Q2lHJD4B9hh7o';

const supabase = createClient(supabaseUrl, supabaseKey);

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const { data: fetchedData, error } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard data:', error);
        return;
      }
      // Add a 'rank' property to each item in the fetched data
      const rankedData = fetchedData.map((item, index) => ({
        ...item,
        rank: index + 1,
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
              <Text style={styles.itemText}>{item.user_name}</Text>
              <Text style={styles.itemText1}>{item.score}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default LeaderboardScreen;
