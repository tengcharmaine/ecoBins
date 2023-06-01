import { Tabs } from "expo-router";
import { Entypo } from "react-native-vector-icons";

export default function HomeScreen() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Profile" }} />
            <Tabs.Screen name="submit" options={{ title: "Submit" }} />
            <Tabs.Screen name="binsnearme" options={{ title: "Bins Near Me"}} />
            <Tabs.Screen name="recyclable" options={{ title: "Recyclable?"}} />
            <Tabs.Screen name="rewards" options={{ title: "Rewards"}} />
            <Tabs.Screen name="ranking" options={{ title: "Ranking"}} />
        </Tabs>
    );
}