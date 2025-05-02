import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing and retrieving user data

const CoursesScreen = ({ navigation }: any) => {
  interface Course {
    _id: string;
    title: string;
    instructor: string;
    category: string;
    price: string;
    rating: number;
    reviews: number;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Store user data

  const fetchStudentCourses = React.useCallback(async (token: string) => {
    try {
      const response = await axios.get<Course[]>(`${API_BASE_URL}/student/courses`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching student courses:", error);
    }
  }, []);

  const fetchInstructorCourses = React.useCallback(async (token: string) => {
    try {
      const response = await axios.get<Course[]>(`${API_BASE_URL}/instructor/courses`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    }
  }, []);

  useEffect(() => {

    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user"); // Retrieve user data from AsyncStorage
        const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage

        if (userData && token) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Fetch courses based on user role
          if (parsedUser.role === "student") {
            await fetchStudentCourses(token);
          } else if (parsedUser.role === "instructor") {
            await fetchInstructorCourses(token);
          }
        } else {
          setUser(null); // No user logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [fetchInstructorCourses, fetchStudentCourses]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>Please log in to see your courses.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("LoginScreen")} // Navigate to Login screen
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCourseCard = ({ item }: { item: Course }) => (
    <View style={styles.card}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
      <Text style={styles.details}>Category: {item.category}</Text>
      <Text style={styles.details}>Price: {item.price}</Text>
      <Text style={styles.details}>Rating: {item.rating} ({item.reviews} reviews)</Text>
      <TouchableOpacity style={styles.startNowButton}>
        <Text style={styles.actionButtonText}>Start Course</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={courses} renderItem={renderCourseCard} keyExtractor={(item) => item._id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef6ec", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  notLoggedInContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  notLoggedInText: { fontSize: 18, color: "gray", marginBottom: 20, textAlign: "center" },
  loginButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 5 },
  loginButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 10, marginBottom: 10, elevation: 2 },
  courseTitle: { fontSize: 16, fontWeight: "bold" },
  instructor: { color: "gray", marginTop: 4 },
  details: { marginVertical: 6 },
  startNowButton: { backgroundColor: "#bc6d0f", padding: 12, borderRadius: 5, marginTop: 10, alignItems: "center" },
  actionButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
});

export default CoursesScreen;