import React, { useRef, useEffect, useState  }  from "react";
import { View, Image, Text, Animated, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./index";
import BinsScreen from "./binsnearme";
import Recyclable from "./recyclable";
import Movement from "./rewards";
import LeaderboardStackScreen from "./ranking";
import { Font } from 'expo'
import { useFonts } from 'expo-font';

const Tab = createBottomTabNavigator();

export default function Screen() {
  
  // method to load fonts used
  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
    Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
    Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });
  
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// method to create the tab bar
function CustomTabBar({ state, descriptors, navigation }) {
  const [selectedTab, setSelectedTab] = useState(state.index);

  const tabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate tab scale when selectedTab changes
    Animated.spring(tabScale, {
      toValue: 1.1,
      useNativeDriver: true,
      delay: 0
    }).start();
  }, [selectedTab]);

  // method to handle selection of a new tab
  const handleTabPress = (index) => {
    if (index !== selectedTab) {
      // Animate tab scale when a new tab is selected
      Animated.spring(tabScale, {
        toValue: 1,
        useNativeDriver: true,
        delay: 0
      }).start(() => {
        setSelectedTab(index);
        navigation.navigate(state.routeNames[index]);
      });
    }
  };

  const tabWidth = windowWidth / state.routes.length;
  const tabHeight = 50;

  // to make sure that fonts are loaded
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    // Tab bar components
    <View style={{ flexDirection: "row", justifyContent: "space-around", backgroundColor: "white", }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName = "";
            let tabName = "";
            switch (route.name) {

              // home screen
              case "index":
                iconName = isFocused ? "home" : "home-outline";
                tabName = "HOME";
                break;

                // bins near me screen
              case "binsnearme":
                iconName = isFocused ? "map-marker" : "map-marker-outline";
                tabName = "MAP";
                break;

                // recyclable screen
              case "recyclable":
                iconName = isFocused ? "camera" : "camera-outline";
                tabName = "SCAN";
                break;

                // rewards screen
              case "rewards":
                iconName = isFocused ? "gift" : "gift-outline";
                tabName = "REWARDS";
                break;

                // ranking screen
              case "ranking":
                iconName = isFocused ? "podium-gold" : "podium";
                tabName = "RANK";
                break;
              default:
                break;
            }

        const iconSize = isFocused ? 25 : 30;
        const iconColor = isFocused ? "white" : "grey";

        const tabScaleValue = isFocused ? tabScale : 1;

        return (
          // combining of components of tab bar
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(index)}
            style={{ alignItems: "center"}}
          >
            <Animated.View style={{ transform: [{ scale: tabScaleValue }] }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isFocused ? "black" : "white",
                  borderRadius: 15,
                  justifyContent: "center",
                  //paddingHorizontal: 10,
                  //paddingVertical: 5,
                  //padding: 10,
                  marginHorizontal: 5,
                  marginBottom: 20,
                  width: tabName == "REWARDS" && isFocused ? tabWidth + 20 : (isFocused ? tabWidth : tabWidth - 32),
                  height: 50,
                }}
              >
                <Icon name={iconName} size={iconSize} color={iconColor} />
                {isFocused && (
                  <Text style={{ color: "white", marginLeft: 5, fontFamily: "Poppins_SemiBold" }}>
                    {tabName}
                  </Text>
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

return (
  // linking tab bar to the screens
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' } 
      }}
      >
            <Tab.Screen name="index" component={HomeScreen} options={{ title: "Profile"}} />
            <Tab.Screen name="binsnearme" component={BinsScreen} options={{ title: "Bins Near Me" }} />
            <Tab.Screen name="recyclable" component={Recyclable} options={{ title: "Recyclable?" }} />
            <Tab.Screen name="rewards" component={Movement} options={{ title: "Rewards"}} />
            <Tab.Screen name="ranking" component={LeaderboardStackScreen} options={{ title: "Ranking"}} />
      </Tab.Navigator>
  );
}
