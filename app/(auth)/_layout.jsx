import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './Register';
import LoginPage from './Login';
import ForgetPasswordScreen from './Forgetpassword';
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
          <Stack.Screen name="Forget Password" component={ForgetPasswordScreen} />
        </Stack.Navigator>
      </SafeAreaProvider>
  );
}