import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { Text } from 'react-native-paper';

import { getStateFromPath } from '@react-navigation/native';
//import ResetPasswordScreen from './resetPassword';
import Register from './Register';
import LoginPage from './Login';
import { supabase } from "../../lib/supabase";
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import OTPScreen from './otp';
import PasswordUpdate from '../PasswordUpdate';
import PasswordRecovery from './PasswordRecovery';

const Stack = createStackNavigator();
const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Login: "login",
      PasswordUpdate: "reset-password",
    
    },
  },
  getStateFromPath: (path, options) => {
    const accessiblePath = path.replace("#", "?");

    return getStateFromPath(accessiblePath, options);
  },
};



export default function AuthRoot() {
//   const [showPasswordReset, setShowPasswordReset] = useState(false);

//   const showPasswordResetScreen = (show) => {
//     setShowPasswordReset(show);
//   };

//   useEffect(() => {
//     const { data } = supabase.auth.onAuthStateChange((event, session) => {
//     if (event === 'PASSWORD_RECOVERY') {
//       console.log('PASSWORD_RECOVERY', session);
//       // Show screen to update the user's password
//       showPasswordResetScreen(true);
//     }
//   });

//   // Register the event listener
//   //supabase.auth.onAuthStateChange(passwordRecoveryHandler);

//   // Clean up the event listener on component unmount
//   return () => data.subscription.unsubscribe();
// }, []);

return (
      <SafeAreaProvider>
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>} independent = {true}>

          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {backgroundColor : '#c7dede',},
              lazy: false
            }}
          >
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={Register} />
            {/* <Stack.Screen name="PasswordRecovery" component={PasswordRecovery}/>
             <Stack.Screen name="PasswordUpdate" component={PasswordUpdate}/>  */}
            
          </Stack.Navigator>
         </NavigationContainer>
      </SafeAreaProvider>
  );
}