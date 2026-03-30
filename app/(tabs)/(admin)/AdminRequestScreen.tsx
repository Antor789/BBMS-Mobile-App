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

interface BusRequest {
  request_id: number;
  user_id: number;
  student_name?: string; // Added to support the JOIN in server.js
  status: "Pending" | "Approved" | "Rejected";
  route_name: string;
}

export default function AdminRequestScreen() {
  const [requests, setRequests] = useState<BusRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      // Corrected path to match unified server.js
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
      // FIX: Matches the server.js route: app.put('/api/admin/pass-requests/:id', ...)
      // We only need /admin/pass-requests/ because apiClient adds the /api/ prefix.
      await apiClient.put(`/admin/pass-requests/${id}`, { status: newStatus });

      Alert.alert("Success", `Request is now ${newStatus}`);
      fetchRequests();
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "Update failed. Check backend connectivity.");
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
            <Text style={styles.name}>
              {item.student_name || `User ID: ${item.user_id}`}
            </Text>
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
