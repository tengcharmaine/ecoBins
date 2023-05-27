import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "login",
};

export default function AuthRoot() {
    return (
        <Stack screenOptions = {{headerStyle: {backgroundColor : '#c7dede',}}} />
    );
}