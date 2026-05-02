import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";

export default function FeedbackScreen() {
  interface FeedbackItem {
    feedback_id: number;
    message: string;
    rating: number;
    admin_reply?: string;
  }

  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  // Ref to track the timer so we can cancel it if the user leaves the screen
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get("/student/feedback/1");
      setFeedbackHistory(response.data);
      await apiClient.put("/student/feedback/mark-read/1");
    } catch (error) {
      console.error("History Fetch Error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Cleanup timer on unmount
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return Alert.alert("Error", "Please write a message.");

    setLoading(true);
    try {
      await apiClient.post("/feedback", {
        userId: 1,
        message: message,
        rating: rating,
      });

      Alert.alert(
        "Success",
        "Feedback submitted! This view will refresh shortly.",
      );

      // 1. Immediately refresh the history list
      fetchHistory();

      // 2. Set a timer to clear the input and reset rating after 2 minutes
      clearTimerRef.current = setTimeout(() => {
        setMessage("");
        setRating(5);
        console.log("Feedback form cleared automatically after 2 minutes.");
      }, 120000); // 120,000ms = 2 Minutes
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "Could not connect to server.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => {
    const isAdmin = !!item.admin_reply;
    return (
      <View
        style={[
          styles.messageBubble,
          isAdmin ? styles.adminBubble : styles.studentBubble,
        ]}
      >
        <View style={styles.bubbleHeader}>
          <Text style={[styles.messageText, isAdmin && styles.adminText]}>
            {item.message}
          </Text>
          <Text style={[styles.starText, isAdmin && styles.adminStarText]}>
            {item.rating} ★
          </Text>
        </View>
        {item.admin_reply && (
          <View style={styles.replyContainer}>
            <View style={styles.replyDivider} />
            <Text style={styles.replyLabel}>Admin Reply:</Text>
            <Text style={styles.replyText}>{item.admin_reply}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.headerSection}>
        <Text style={styles.header}>Support & Feedback</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={30}
                color={star <= rating ? "#FFD700" : "#BDC3C7"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={feedbackHistory}
        keyExtractor={(item) => item.feedback_id.toString()}
        renderItem={renderFeedbackItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={fetchHistory}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No conversation history yet.</Text>
        }
      />

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#94A3B8"
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="send" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  headerSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 10,
  },
  starRow: { flexDirection: "row", justifyContent: "center" },
  listContent: { padding: 20 },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    maxWidth: "85%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  studentBubble: { alignSelf: "flex-end", backgroundColor: "#007AFF" },
  adminBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: { fontSize: 15, color: "white" },
  adminText: { color: "#1E293B" },
  bubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "bold",
  },
  adminStarText: { color: "#94A3B8" },
  replyContainer: { marginTop: 10, paddingTop: 10 },
  replyDivider: { height: 1, backgroundColor: "#E2E8F0", marginBottom: 10 },
  replyLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
  },
  replyText: { fontSize: 14, color: "#1E293B", marginTop: 2 },
  inputSection: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    color: "#1E293B",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 50 },
});
