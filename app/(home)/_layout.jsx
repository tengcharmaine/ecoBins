import React, { useRef, useEffect, useState  }  from "react";
import { View, Image, Text, Animated, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import FriendsStack from ".";
import SubmitScreen from "./submit";
import BinsScreen from "./binsnearme";
import Recyclable from "./recyclable";
import Movement from "./rewards";
import LeaderboardStackScreen from "./ranking";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {

function CustomTabBar({ state, descriptors, navigation }) {
  const [selectedTab, setSelectedTab] = useState(state.index);

  const tabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate tab scale when selectedTab changes
    Animated.spring(tabScale, {
      toValue: 1.2,
      useNativeDriver: true,
      delay: 0
    }).start();
  }, [selectedTab]);

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

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName = "";
            let tabName = "";
            switch (route.name) {
              case "index":
                iconName = isFocused ? "account-circle" : "account-circle-outline";
                tabName = "HOME";
                break;
              case "binsnearme":
                iconName = isFocused ? "map-marker" : "map-marker-outline";
                tabName = "MAP";
                break;
              case "recyclable":
                iconName = isFocused ? "camera" : "camera-outline";
                tabName = "SCAN";
                break;
              case "rewards":
                iconName = isFocused ? "gift" : "gift-outline";
                tabName = "REWARDS";
                break;
              case "ranking":
                iconName = isFocused ? "podium-gold" : "podium";
                tabName = "RANK";
                break;
              default:
                break;
            }

        const iconSize = isFocused ? 30 : 25;
        const iconColor = isFocused ? "white" : "black";

        const tabScaleValue = isFocused ? tabScale : 1;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(index)}
            style={{ alignItems: "center" }}
          >
            <Animated.View style={{ transform: [{ scale: tabScaleValue }] }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isFocused ? "black" : "white",
                  borderRadius: 15,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginHorizontal: 5,
                  marginBottom: 20,
                  width: tabName == "REWARDS" && isFocused ? 110 : (isFocused ? 90 : 50),
                  height: 50,
                }}
              >
                <Icon name={iconName} size={iconSize} color={iconColor} />
                {isFocused && (
                  <Text style={{ color: "white", fontFamily: 'Thonburi-Bold', marginLeft: 5 }}>
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
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false
      }}
      >
            <Tab.Screen name="index" component={FriendsStack} options={{ title: "Profile"}} />
            {/* <Tab.Screen name="submit" component={SubmitScreen} options={{ title: "Submit" }} /> */}
            <Tab.Screen name="binsnearme" component={BinsScreen} options={{ title: "Bins Near Me" }} />
            <Tab.Screen name="recyclable" component={Recyclable} options={{ title: "Recyclable?" }} />
            <Tab.Screen name="rewards" component={Movement} options={{ title: "Rewards"}} />
            <Tab.Screen name="ranking" component={LeaderboardStackScreen} options={{ title: "Ranking"}} />
      </Tab.Navigator>
  );
}
