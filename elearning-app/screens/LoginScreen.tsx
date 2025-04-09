import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For the cross icon
import axios from "axios";

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
        message?: string;
      };

      const response = await axios.post<LoginResponse>(
        "http://172.20.28.97:5000/api/auth/login", // FIXED URL
        { email, password }
      );

      if (response.data.success) {
        Alert.alert("Success", "Login successful!");

        // TODO: Save the token for authentication (if provided)
        // Example: AsyncStorage.setItem('token', response.data.token);

        // Navigate to Home screen
        navigation.navigate("Main");
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
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "LOGIN"}</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
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
