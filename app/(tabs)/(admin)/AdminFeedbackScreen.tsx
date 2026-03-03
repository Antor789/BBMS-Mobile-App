import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient"; //

interface FeedbackItem {
  feedback_id: number;
  student_name: string; // Matches the JOIN query
  message: string;
  rating: number; // Matches the new MySQL column
  created_at: string;
}

export default function AdminFeedbackScreen() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedback = async () => {
      try {
        const response = await apiClient.get("/admin/feedback");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    getFeedback();
  }, []);

  const renderStars = (rating: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={s <= rating ? "star" : "star-outline"}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Feedback</Text>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.feedback_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.student_name}</Text>
              {renderStars(item.rating)}
            </View>
            <Text style={styles.msg}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starRow: { flexDirection: "row" },
  name: { fontWeight: "bold", color: "#007AFF" },
  msg: { fontSize: 15, marginTop: 5 },
});
