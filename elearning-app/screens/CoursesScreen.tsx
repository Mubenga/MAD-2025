import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

const CoursesScreen = () => {
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
  const [activeTab, setActiveTab] = useState("Ongoing");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>("http://172.20.28.97:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
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
      <View style={styles.tabsContainer}> 
        {["Ongoing", "Attempted"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={courses} renderItem={renderCourseCard} keyExtractor={(item) => item._id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef6ec", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  tab: { fontSize: 18, color: "gray" },
  activeTab: { color: "#007bff", borderBottomWidth: 2, borderBottomColor: "#007bff", paddingBottom: 4 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 10, marginBottom: 10, elevation: 2 },
  courseTitle: { fontSize: 16, fontWeight: "bold" },
  instructor: { color: "gray", marginTop: 4 },
  details: { marginVertical: 6 },
  startNowButton: { backgroundColor: "#bc6d0f", padding: 12, borderRadius: 5, marginTop: 10, alignItems: "center" },
  actionButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
});

export default CoursesScreen;
