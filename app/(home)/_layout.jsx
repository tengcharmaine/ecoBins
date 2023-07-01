// import { SafeAreaView, View, Image } from "react-native";
// import { Tabs } from "expo-router";
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function HomeScreen() {
//     function profileScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="account-circle-outline" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };

//     function submitScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="file-document-edit-outline" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };

//     function binsScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="map-marker-outline" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };

//     function recyclableScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="camera-outline" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };

//     function rewardsScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="gift-outline" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };

//     function rankingScreen() {
//         return (
//             <SafeAreaView style={{flex: 1}}>
//                 <View style={{flex: 1}}>
//                     <Icon name="podium-gold" size={35}/>
//                 </View>
//             </SafeAreaView>
//         );
//     };
    

//     return (
//         <Tabs screenOptions={{tabBarBackground: () => 
//                                 (<Image source={require("../../images/c7dede.png")}
//                                     style={{width: '100%'}}/>),
//                                 headerStyle: {backgroundColor : '#c7dede',}
//                             }}>
//             <Tabs.Screen name="index" options={{ title: "Profile",
//                                                  tabBarIcon: profileScreen }} />
//             <Tabs.Screen name="submit" options={{ title: "Submit",
//                                                   tabBarIcon: submitScreen }} />
//             <Tabs.Screen name="binsnearme" options={{ title: "Bins Near Me",
//                                                       tabBarIcon: binsScreen}} />
//             <Tabs.Screen name="recyclable" options={{ title: "Recyclable?",
//                                                       tabBarIcon: recyclableScreen}} />
//             <Tabs.Screen name="rewards" options={{ title: "Rewards",
//                                                    tabBarIcon: rewardsScreen}} />
//             <Tabs.Screen name="ranking" options={{ title: "Ranking",
//                                                    tabBarIcon: rankingScreen}} />
//         </Tabs>
//     );
// }

import React from "react";
import { SafeAreaView, View, Image } from "react-native";
import { Tabs } from "expo-router";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
    function profileScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="account-circle-outline" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };

    function submitScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="file-document-edit-outline" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };

    function binsScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="map-marker-outline" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };

    function recyclableScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="camera-outline" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };

    function rewardsScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="gift-outline" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };

    function rankingScreen({ color }) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <Icon name="podium-gold" size={35} color={color} />
                </View>
            </SafeAreaView>
        );
    };
    

    return (
        <Tabs
            screenOptions={{
                tabBarBackground: () => (
                    <Image source={require("../../images/c7dede.png")} style={{width: '100%'}}/>
                ),
                headerStyle: {backgroundColor : '#c7dede'},
                tabBarIcon: ({ color }) => (
                    <Icon name="your-icon-name" size={35} color={color} />
                ),
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Profile", tabBarIcon: profileScreen }} />
            <Tabs.Screen name="submit" options={{ title: "Submit", tabBarIcon: submitScreen }} />
            <Tabs.Screen name="binsnearme" options={{ title: "Bins Near Me", tabBarIcon: binsScreen }} />
            <Tabs.Screen name="recyclable" options={{ title: "Recyclable?", tabBarIcon: recyclableScreen }} />
            <Tabs.Screen name="rewards" options={{ title: "Rewards", tabBarIcon: rewardsScreen }} />
            <Tabs.Screen name="ranking" options={{ title: "Ranking", tabBarIcon: rankingScreen }} />
        </Tabs>
    );
}