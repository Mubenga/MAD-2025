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
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { WebView } from "react-native-webview";

const HomeScreen = ({ navigation }: { navigation: DrawerNavigationProp<any> }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://172.20.28.97:5000/api/courses");
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

  const categories = ["Design", "Business", "Programming", "IT & Software"];

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
        <Button title="Retry" onPress={() => navigation.navigate("Main")} />
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
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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
                  <TouchableOpacity onPress={() => setSelectedVideo(item.youtubeVideoIds[0])}>
                    <Image source={{ uri: item.image }} style={styles.courseImage} />
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <Text style={styles.courseInstructor}>{item.instructor?.name || "Unknown Instructor"}</Text>
                    <Text style={styles.coursePrice}>{item.price || "Free"}</Text>
                  </TouchableOpacity>
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
  courseImage: {
    width: 150,
    height: 100,
    marginRight: 10,
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
