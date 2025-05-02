import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For the cross icon
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For session management
import { API_BASE_URL } from "../config/api";

type LoginScreenProps = {
  navigation: NavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Define response type
      type LoginResponse = {
        success: boolean;
        token?: string;
        user?: {
          id: string;
          name: string;
          email: string;
          role: string; // e.g., "student" or "instructor"
        };
        message?: string;
      };

      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`, // FIXED URL
        { email, password }
      );

      if (response.data.success) {
        Alert.alert("Success", "Login successful!");

        // Save the token and user data in AsyncStorage
        if (response.data.token && response.data.user) {
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Navigate to Home screen
        navigation.navigate("Home", { screen: "Courses" });
      } else {
        Alert.alert("Error", response.data.message || "Invalid email or password.");
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      if (error.response) {
        // Handle different response status codes
        if (error.response.status === 401) {
          Alert.alert("Login Failed", "Invalid credentials. Please try again.");
        } else {
          Alert.alert("Error", error.response.data.message || "An unexpected error occurred.");
        }
      } else {
        Alert.alert("Error", "Cannot connect to the server. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.crossButton}
        accessibilityLabel="Close login screen"
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          Register Here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  crossButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkText: {
    marginVertical: 15,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
});