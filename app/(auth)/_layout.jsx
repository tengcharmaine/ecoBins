// import { Stack } from "expo-router";
// import { createStackNavigator, createAppContainer } from 'react-navigation-stack';
// import Register from "./Register";
// import LoginPage from "./Login";

// export const unstable_settings = {
//     initialRouteName: "Login",
// };

// export default function AuthRoot() {
//     return (
//         <Stack screenOptions = {{headerStyle: {backgroundColor : '#c7dede',}}} />
//     );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Register';
import LoginPage from './Login';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function AuthRoot() {
  return (
      <SafeAreaProvider>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {backgroundColor : '#c7dede',}
          }}
        >
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={LoginPage} />
          {/* <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          /> */}
        </Stack.Navigator>
      </SafeAreaProvider>
  );
}