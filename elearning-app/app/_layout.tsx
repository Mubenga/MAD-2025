import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppTabs from "../components/AppTabs";
import CustomDrawer from "../components/CustomDrawer"; // Custom Drawer component
import ProfileScreen from "../screens/ProfileScreen";
import CoursesScreen from "../screens/CoursesScreen";
import LoginScreen from "../screens/LoginScreen"; // Login Screen
import RegisterScreen from "../screens/RegisterScreen"; // Register Screen

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (Sidebar) - Controls the sidebar navigation
function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Courses" component={CoursesScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// Main Layout (Stack Navigator) - Handles screen transitions for login, register, and main content
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Drawer Navigator */}
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      {/* Login Screen */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* Register Screen */}
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}