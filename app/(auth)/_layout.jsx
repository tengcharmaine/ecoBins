import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: "Login",
};

export default function AuthRoot() {
    return (
        <Stack screenOptions = {{headerStyle: {backgroundColor : '#c7dede',}}} />
    );
}