import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Image, Alert, ActivityIndicator 
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Picker } from "@react-native-picker/picker";

type RegisterResponse = {
  success: boolean;
  message?: string;
  token?: string; // Include if your backend returns a token on successful registration
};

type RootStackParamList = {
  RegisterScreen: undefined;
  LoginScreen: undefined;
};

type RegisterScreenProps = {
  navigation: NavigationProp<RootStackParamList, "RegisterScreen">;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role is student
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // ✅ Validation: Ensure all fields are filled
    if (!name || !email || !mobile || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // ✅ Mobile number validation
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      Alert.alert("Error", "Please enter a valid mobile number (10-15 digits).");
      return;
    }

    // ✅ Password length check
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Make an API request to register the user
      const response = await axios.post<RegisterResponse>(
        `${API_BASE_URL}/auth/register`, // Updated endpoint for registration
        {
          name,
          email,
          mobile,
          password,
          role, // Include the selected role
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("LoginScreen"); // ✅ Navigate to Login after successful registration
      } else {
        Alert.alert("Error", response.data.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert("Error", "Server not found. Please check your backend API URL.");
        } else if (error.response.status === 400) {
          Alert.alert("Error", error.response.data.message || "Invalid registration details.");
        } else {
          Alert.alert("Error", `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        Alert.alert("Error", "No response from server. Check your network connection.");
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.crossButton}
        accessibilityLabel="Close register screen"
      >
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* App Logo / Image */}
      <Image source={require("../assets/images/course-2.png")} style={styles.image} />

      {/* Input Fields */}
      <TextInput
        placeholder="Enter Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Password (min. 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Role Selection */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Role:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Instructor" value="instructor" />
        </Picker>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>REGISTER</Text>
        )}
      </TouchableOpacity>

      {/* Navigation to Login */}
      <Text style={styles.linkText}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Login Here
        </Text>
      </Text>
    </View>
  );
}

// 🔹 Styles remain the same with additional styles for the picker
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
  },
  pickerLabel: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
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