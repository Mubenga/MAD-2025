import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const HomeScreen = ({ navigation }: { navigation: DrawerNavigationProp<any> }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when the component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token); // Set to true if token exists
    };
    checkLoginStatus();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        console.error("Failed to fetch courses:", err.message);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Remove the token
      await AsyncStorage.removeItem("user"); // Remove user data
      setIsLoggedIn(false); // Update the state
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("Home"); // Redirect to the Home screen
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!userData || !token) {
        Alert.alert("Not Logged In", "Please log in to enroll in a course.");
        navigation.navigate("LoginScreen");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role !== "student") {
        Alert.alert("Access Denied", "Only students can enroll in courses.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("Success", "You have successfully enrolled in the course!");
      } else {
        Alert.alert("Error", result.message || "Failed to enroll in the course.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      Alert.alert("Error", "An error occurred while enrolling in the course.");
    }
  };

  const handlePlayVideo = async (courseId: string, videoId: string) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!userData || !token) {
        Alert.alert("Not Logged In", "Please log in to play the video.");
        navigation.navigate("LoginScreen");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role !== "student") {
        Alert.alert("Access Denied", "Only students can play course videos.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}/is-enrolled`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.enrolled) {
        setSelectedVideo(videoId); // Allow video to play
      } else {
        Alert.alert("Access Denied", "You must enroll in the course to play the video.");
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      Alert.alert("Error", "An error occurred while checking enrollment.");
    }
  };

  const categories = ["Design", "Business", "Programming", "IT & Software", "Mathematics", "Geography"];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        {isLoggedIn ? (
          <TouchableOpacity onPress={handleLogout} style={styles.loginButton}>
            <Text style={styles.loginText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedVideo ? (
        <View style={styles.videoContainer}>
          <WebView source={{ uri: `https://www.youtube.com/embed/${selectedVideo}` }} style={styles.webView} />
          <Button title="Cancel" onPress={() => setSelectedVideo(null)} color="#007bff" />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="gray" />
            <Text style={styles.searchText}>Search</Text>
          </View>

          {/* Categories */}
          {categories.map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.sectionTitle}>Top courses in {category}</Text>
              <FlatList
                data={courses.filter((course) => course.category === category)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.courseCard}>
                    <TouchableOpacity
                      onPress={() => handlePlayVideo(item._id, item.youtubeVideoIds[0])} // Restrict video play
                    >
                      <Image source={{ uri: item.image }} style={styles.courseImage} />
                      <Text style={styles.courseTitle}>{item.title}</Text>
                      <Text style={styles.courseInstructor}>{item.instructor?.name || "Unknown Instructor"}</Text>
                      <Text style={styles.coursePrice}>{item.price || "Free"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.enrollButton}
                      onPress={() => handleEnroll(item._id)} // Handle enrollment
                    >
                      <Text style={styles.enrollButtonText}>Enroll</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6ec",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuIcon: {
    marginLeft: 12,
  },
  loginButton: {
    marginRight: 12,
  },
  loginText: {
    color: "#007bff",
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchText: {
    marginLeft: 10,
    color: "gray",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  courseCard: {
    marginRight: 10,
    width: 150,
  },
  courseImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  courseInstructor: {
    fontSize: 12,
    color: "gray",
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
  },
  enrollButton: {
    backgroundColor: "black",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  enrollButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  videoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  webView: {
    height: 300,
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default HomeScreen;