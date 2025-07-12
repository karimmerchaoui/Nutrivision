import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from './store/userContext'; // adjust path 
import DescriptionScreen from "./DescriptionScreen";
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen0 from './SignUpScreen0';
import SignUpScreen1 from './SignUpScreen1';
import SignUpScreen2 from './SignUpScreen2';
import CameraScreen from "./CameraScreen";
import ProfileScreen from "./ProfileScreen";
import HistoryScreen from './FoodHistory';
import OnboardingScreen from './onBoarding';
import ResetPasswordScreen from "./ResetPasswordScreen";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DescriptionSheetContent from './store/DescriptionSheetContent';

const Stack = createNativeStackNavigator();

export default function Main() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <UserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen0" component={SignUpScreen0} />
      <Stack.Screen name="SignUpScreen1" component={SignUpScreen1} />
      <Stack.Screen name="SignUpScreen2" component={SignUpScreen2} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="DescriptionSheet" component={DescriptionSheetContent} />
      <Stack.Screen name="Description" component={DescriptionScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </UserProvider>
    </GestureHandlerRootView>
  );
}
