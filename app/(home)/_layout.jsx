import React, { useRef, useEffect }  from "react";
import { View, Image, Text, Animated } from "react-native";
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

function CustomTabBarIcon({ iconName, focused, tabName }) {
  const buttonWidth = tabName == "REWARDS" && focused ? 100 : (focused ? 90 : 50);
    return (
    <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: focused ? "black" : "white",
      borderRadius: 15,
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 5,
      width: buttonWidth,
      height: 50,
    }}
  >
    <View >
          <Icon name={iconName} size={focused? 25 : 30} color={focused ? "white" : "black"} />
        </View>
        {focused && <Text style={{ color: "white", fontFamily: 'Thonburi-Bold', marginLeft: 5 }}>{tabName}</Text>}
      </View>
    );
  }

return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
            let tabName = "";
            switch (route.name) {
              case "index":
                iconName = focused ? "account-circle" : "account-circle-outline";
                tabName = "HOME";
                break;
            //   case "submit":
            //     iconName = focused ? "file-document-edit" : "file-document-edit-outline";
            //     tabName = "Submit";
            //     break;
              case "binsnearme":
                iconName = focused ? "map-marker" : "map-marker-outline";
                tabName = "MAP";
                break;
              case "recyclable":
                iconName = focused ? "camera" : "camera-outline";
                tabName = "SCAN";
                break;
              case "rewards":
                iconName = focused ? "gift" : "gift-outline";
                tabName = "REWARDS";
                break;
              case "ranking":
                iconName = focused ? "podium-gold" : "podium";
                tabName = "RANK";
                break;
              default:
                break;
            }
            return <CustomTabBarIcon iconName={iconName} focused={focused} tabName={tabName}/>;
          },
            tabBarLabelStyle: { display: "none" },
            tabBarStyle: { height: "10%", marginLeft: 5, marginRight: 5, justifyContent: "space-between" },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "black",
            
        })}
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
