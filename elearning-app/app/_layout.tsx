import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppTabs from "../components/AppTabs";
import CustomDrawer from "../components/CustomDrawer";
import ProfileScreen from "../screens/ProfileScreen";
import CoursesScreen from "../screens/CoursesScreen";
import LoginScreen from "../screens/LoginScreen"; // Import the LoginScreen
import RegisterScreen from "../screens/RegisterScreen"; // Import the RegisterScreen

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator (Sidebar)
function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="Courses" component={CoursesScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// Main Layout (Stack Navigator)
export default function Layout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main App (Drawer Navigator) */}
      <Stack.Screen name="Main" component={DrawerNavigator} />
      {/* Login Screen */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* Register Screen */}
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}