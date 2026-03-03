import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";

// 1. Aligned Interface with your MySQL 'buspassrequest' table columns
interface BusRequest {
  request_id: number;
  user_id: number;
  status: "Pending" | "Approved" | "Rejected";
  route_name: string;
}

export default function AdminRequestScreen() {
  const [requests, setRequests] = useState<BusRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      // Changed to match server.js route exactly (removed 'api/' to prevent double URL routing)
      const response = await apiClient.get("/admin/pass-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: number,
    newStatus: "Approved" | "Rejected",
  ) => {
    try {
      // Changed to match server.js route exactly
      await apiClient.put(`/admin/pass-requests/${id}`, { status: newStatus });
      Alert.alert("Updated", `Request has been ${newStatus}`);
      fetchRequests(); // Refresh the list from MySQL
    } catch (error) {
      Alert.alert("Error", "Update failed. Check your backend terminal.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Bus Passes</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.request_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Swapped student_name for user_id to match your database output */}
            <Text style={styles.name}>User ID: {item.user_id}</Text>
            <Text style={styles.routeText}>Route: {item.route_name}</Text>
            <Text
              style={[
                styles.status,
                { color: item.status === "Pending" ? "#f39c12" : "#27ae60" },
              ]}
            >
              Status: {item.status}
            </Text>

            {item.status === "Pending" && (
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleUpdate(item.request_id, "Approved")}
                >
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleUpdate(item.request_id, "Rejected")}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending requests found.</Text>
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  routeText: { fontSize: 14, color: "#7f8c8d", marginVertical: 4 },
  status: { fontSize: 14, fontWeight: "600", marginBottom: 10 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveBtn: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  rejectBtn: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#95a5a6",
    fontSize: 16,
  },
});
