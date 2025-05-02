import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

const CustomDrawer = (props: DrawerContentComponentProps) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <View style={styles.profileContainer}>
          <Image source={require("../assets/images/gmn.png")} style={styles.profileImage} />
          <Text style={styles.profileName}>Gedeon Mubenga</Text>
          <Text style={styles.profileText}>My Profile</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="My Exams"
            onPress={() => props.navigation.navigate("MyExams")}
            icon={({ color, size }) => (
              <Ionicons name="school-outline" size={size} color={color} />
            )}
          />
          <DrawerItem
            label="Class Reminder"
            onPress={() => props.navigation.navigate("ClassReminder")}
            icon={({ color, size }) => (
              <Ionicons name="alarm-outline" size={size} color={color} />
            )}
          />
          <DrawerItem
            label="Contact Us"
            onPress={() => props.navigation.navigate("ContactUs")}
            icon={({ color, size }) => (
              <Ionicons name="call-outline" size={size} color={color} />
            )}
          />
          <DrawerItem
            label="Referral"
            onPress={() => props.navigation.navigate("Referral")}
            icon={({ color, size }) => (
              <Ionicons name="gift-outline" size={size} color={color} />
            )}
          />
          <DrawerItem
            label="Support"
            onPress={() => props.navigation.navigate("Support")}
            icon={({ color, size }) => (
              <Ionicons name="help-circle-outline" size={size} color={color} />
            )}
          />
        </View>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          props.navigation.navigate("Home"); // Navigate to Home
          console.log("Logout Pressed");
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#333" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4699b1",
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 75,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  profileText: {
    color: "#fff",
    fontSize: 14,
  },
  drawerItemsContainer: {
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default CustomDrawer;