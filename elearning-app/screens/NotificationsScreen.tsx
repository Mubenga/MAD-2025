import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

interface Notification {
  id: string;
  date: string;
  description: string;
}

const notifications = [
  {
    id: "1",
    date: "20 Jan 2021",
    description: "Maths page number 58 (practice) solve science write short question and answer of page no is from wb.",
  },
  {
    id: "2",
    date: "20 Jan 2021",
    description: "Maths page number 58 (practice) solve science write short question and answer of page no is from wb.",
  },
  {
    id: "3",
    date: "20 Jan 2021",
    description: "Maths page number 58 (practice) solve science write short question and answer of page no is from wb.",
  },
];

const NotificationsScreen = () => {
  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <Image source={require("../assets/images/course-1.jpg")} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef6ec", padding: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  icon: { width: 40, height: 40, marginRight: 10 },
  textContainer: { flex: 1 },
  date: { fontWeight: "bold", color: "#000", marginBottom: 5 },
  description: { color: "#555", marginBottom: 5 },
});

export default NotificationsScreen;
