import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";

interface Feedback {
  feedback_id: number;
  student_name: string;
  message: string;
  rating: number;
  created_at: string;
}

export default function AdminFeedbackScreen() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      // Matches app.get('/api/admin/feedback') in your server.js
      const response = await apiClient.get("/admin/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Feedback Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Feedback</Text>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.feedback_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.student_name}</Text>
              <Text style={styles.rating}>⭐ {item.rating}/5</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No feedback received yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  rating: { fontSize: 14, fontWeight: "600", color: "#f39c12" },
  message: { fontSize: 14, color: "#34495e", marginTop: 8, lineHeight: 20 },
  date: { fontSize: 12, color: "#95a5a6", marginTop: 10, textAlign: "right" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#95a5a6",
    fontSize: 16,
  },
});
