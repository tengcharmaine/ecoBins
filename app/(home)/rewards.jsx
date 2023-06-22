import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Link, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import { BackHandler } from 'react-native';

const foodcataloguedata = [
    {
        id: 1,
        title: 'Pasta Express',
        description: 'The Deck',
        image: require('../../images/pastaexpress.jpeg'),
        points: '(20 Points)',
        menu1: 'Smoked Duck Aglio Oilo',
        menu2: 'Meat Lovers',
        menu3: 'Creamy Mushroom',
    },
    {
        id: 2,
        title: 'Japanese',
        description: 'The Deck',
        image: require('../../images/japanese.avif'),
        points: '(20 Points)',
        menu1: 'Oyako Don',
        menu2: 'Teriyaki Chicken Don',
        menu3: 'Ramen',
    },
    {
        id: 3,
        title: 'Western',
        description: 'The Deck',
        image: require('../../images/western.jpeg'),
        points: '(20 Points)',
        menu1: 'Fish and Chips',
        menu2: 'Chicken Chop',
        menu3: 'Cabonara Pasta',
    },
    {
        id: 4,
        title: 'Yong Tau Foo',
        description: 'The Deck',
        image: require('../../images/yongtaufoo.jpeg'),
        points: '(20 Points)',
        menu1: '3 items + Noodles (Larger portion)',
        menu2: '4 items + Noodles (Smaller portion)',
        menu3: '5 items',
    },
    {
        id: 5,
        title: 'Ban Mian',
        description: 'Terrace',
        image: require('../../images/banmian.jpeg'),
        points: '(20 Points)',
        menu1: 'Ban Mian',
        menu2: 'Fishball Noodles',
        menu3: 'Fish Soup',
    },
    {
        id: 6,
        title: 'Indian',
        description: 'Terrace',
        image: require('../../images/indian.jpeg'),
        points: '(20 Points)',
        menu1: 'Roti Prata',
        menu2: 'Fish Head Curry',
        menu3: 'Tandoori Chicken',
    }
]

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',  
        // alignItems: 'center',
        padding: 20,
    },

    selectcontainer: {
        flex: 1, 
        justifyContent: 'top',  
        padding: 20,
        backgroundColor: '#c7dede',
        borderRadius: 40,
        marginTop: 10,
    },
    
    button: {
        borderColor: "black",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        width: '25%',
        //marginRight: 200,
        borderRadius: 30,
        height: 40,
    },

    button1: {
        borderColor: "black",
        backgroundColor: 'lightgrey',
        width: '30%',
        alignSelf: 'center',
        borderRadius: 30,
        marginBottom: 10,
    },

    buttonPressed: {
        borderColor: "black",
        alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'grey',
        width: '25%',
        //marginRight: 200,
        borderRadius: 30,
    },

    text1: {
        color: "black",
        marginTop: 20,
        textAlign: 'left',
        marginRight: 230,
        marginBottom: 5,
        fontSize: 15,
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#c7dede',
        borderRadius: 30,
        height: 95,
    },

    textContainer: {
        flex: 1,
        marginRight: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 30,
    },

    description: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 30,
    },

    image: {
        height: 80,
        width: 100,
        borderRadius: 30,
        marginRight: 30,
    },

    pointsheading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 20,
        alignSelf: 'center',
    },
});

export function RewardsScreen() {
    const navigation = useNavigation();
    
    const handleSelectFood = (foodId) => {
        navigation.navigate('Select', { foodId });
    };

    const renderfooditem = ({ item }) => {
        return (
          <View style={styles.container}>
            <TouchableOpacity style={styles.itemContainer} 
                              key={item.id}
                              onPress={() => handleSelectFood(item.id)} >
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
              <Image style={styles.image} source={item.image} />
            </TouchableOpacity>
          </View>
        );
      };
      
      const [remainingPoints, setRemainingPoints] = useState(0);

      useEffect(() => {
        // Fetch the user's score or remaining points from Supabase or any other data source
        const fetchRemainingPoints = async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser()
    
            console.log(user);
            if (user) {
              const { data, error } = await supabase
              .from('redemption')
              .select('score')
              .eq('username', user.id); 
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
    
        const unsubscribe = navigation.addListener('focus', () => {
          fetchRemainingPoints();
        });
    
        return unsubscribe;
      }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.pointsheading}>You have {remainingPoints} points for redemption.</Text>
            <Text style={styles.text1}>Catalogue:</Text>
            <FlatList
            data={foodcataloguedata}
            renderItem={renderfooditem}
            keyExtractor={item => item.id.toString()}/>
        </View>
    )
}

export function SelectionScreen({ route }) {
    const navigation = useNavigation();
    const { foodId } = route.params;
    const selectedFood = foodcataloguedata.find((item) => item.id === foodId);
    const [buttonPressed, setButtonPressed] = useState({
      menu1: false,
      menu2: false,
      menu3: false
    });
  
    const handleButtonPress = (menu) => {
      setButtonPressed((prevButtonPressed) => ({
        menu1: menu === "menu1" ? !prevButtonPressed.menu1 : false,
        menu2: menu === "menu2" ? !prevButtonPressed.menu2 : false,
        menu3: menu === "menu3" ? !prevButtonPressed.menu3 : false,
      }));
    };
  
    const selectedChooseButtons = Object.values(buttonPressed).filter((pressed) => pressed);
    const isConfirmButtonVisible = selectedChooseButtons.length > 0;

    const [remainingPoints, setRemainingPoints] = useState(0);
    const router = useRouter();

      useEffect(() => {
        // Fetch the user's score or remaining points from Supabase or any other data source
        const fetchRemainingPoints = async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser()
    
            console.log(user);
            if (user) {
              const { data, error } = await supabase
              .from('redemption')
              .select('score')
              .eq('username', user.id); 
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
    
        const unsubscribe = navigation.addListener('focus', () => {
          fetchRemainingPoints();
          setButtonPressed({
            menu1: false,
            menu2: false,
            menu3: false
          });
        });
    
        return unsubscribe;
      }, [navigation]);
  
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    };

    useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      
      return () => {
        backHandler.remove();
      };
    }, []);
  
    const handleConfirmation = async () => {
    // const selectedMenuPoints = Object.values(buttonPressed).filter(
    //   (pressed, index) => pressed && index < 3
    // ).length * 20; // Assuming each menu has 20 points
    console.log(3);
    if (remainingPoints >= 20) {
      // Deduct points and proceed with redemption
      // try {
        // const { data: { user } } = await supabase.auth.getUser()
        // console.log(4);
        // if (user) {
        //   console.log(user);
        //   const { data, error } = await supabase
        //     .from('redemption')
        //     .update({ score: remainingPoints - 20 })
        //     .eq('username', user.id)
        //     .single();
        //   if (error) {
        //     console.error('Error updating user points:', error.message);
        //     return;
        //   }
        // setRemainingPoints(user.score);
          // console.log(user.score);
          router.push('QRcode');
      //   }
      // } catch (error) {
      //   console.error('Error updating user points:', error.message);
      // }
    } else {
      alert('Insufficient points. Please select a different menu or earn more points.');
    }
  };
      
    return (
      <View style={styles.container}>
          <Text style={styles.pointsheading}>You have {remainingPoints} points for redemption.</Text>
        <Text style={styles.text1}>Catalogue:</Text>
  
        <View style={styles.selectcontainer}>
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{selectedFood.title}</Text>
              <Text style={styles.description}>{selectedFood.description}</Text>
            </View>
            <Image style={styles.image} source={selectedFood.image} />
          </View>
  
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{selectedFood.menu1}</Text>
              <Text style={styles.description}>{selectedFood.points}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                buttonPressed.menu1 ? styles.buttonPressed : null
              ]}
              onPress={() => handleButtonPress("menu1")}
            >
              <Text style={styles.buttonText}>Choose</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{selectedFood.menu2}</Text>
              <Text style={styles.description}>{selectedFood.points}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                buttonPressed.menu2 ? styles.buttonPressed : null
              ]}
              onPress={() => handleButtonPress("menu2")}
            >
              <Text style={styles.buttonText}>Choose</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{selectedFood.menu3}</Text>
              <Text style={styles.description}>{selectedFood.points}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                buttonPressed.menu3 ? styles.buttonPressed : null
              ]}
              onPress={() => handleButtonPress("menu3")}
            >
              <Text style={styles.buttonText}>Choose</Text>
            </TouchableOpacity>
          </View>
  
          {isConfirmButtonVisible && (
            <Button style={styles.button1} onPress={handleConfirmation}>
              <Text style={styles.text1}>
                Confirm
              </Text>
            </Button>
          )}
          <Button style={styles.button1} onPress={() => navigation.goBack()}>
              <Text style={styles.text1}>Back</Text>
          </Button>
        </View>
      </View>
    );
  }  
  
const Stack = createNativeStackNavigator();

export default function Movement() {
    return (
      <Stack.Navigator initialRouteName="Rewards" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="Select" component={SelectionScreen} />
      </Stack.Navigator>
    );
}