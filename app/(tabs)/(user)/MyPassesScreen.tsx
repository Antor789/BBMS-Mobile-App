import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // <-- NEW IMPORT
import apiClient from "../../../src/api/apiClient";

// Interface matching your MySQL table output
interface BusPass {
  request_id: number;
  route_name: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function MyPassesScreen() {
  const [passes, setPasses] = useState<BusPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyPasses = async () => {
    try {
      const res = await apiClient.get("/student/my-passes/1"); // Fetching for user 1
      setPasses(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyPasses();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyPasses();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "#27ae60"; // Green
      case "Rejected":
        return "#e74c3c"; // Red
      default:
        return "#f39c12"; // Yellow for Pending
    }
  };

  const renderPass = ({ item }: { item: BusPass }) => (
    <View style={styles.passCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.routeName}>{item.route_name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Show Digital Pass details ONLY if approved */}
      {item.status === "Approved" && (
        <View style={styles.qrSection}>
          <Text style={styles.qrActiveText}>DIGITAL PASS ACTIVE</Text>

          {/* THE NEW QR CODE COMPONENT */}
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={`{"pass_id": ${item.request_id}, "route": "${item.route_name}", "status": "Valid"}`}
              size={140}
              color="#2c3e50"
              backgroundColor="white"
            />
          </View>

          <Text style={styles.tapText}>
            Show this to the driver upon boarding
          </Text>
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bus Passes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={passes}
          keyExtractor={(item) => item.request_id.toString()}
          renderItem={renderPass}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              You haven't applied for any bus passes yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
    color: "#333",
  },
  passCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeName: { fontSize: 18, fontWeight: "bold", color: "#2c3e50", flex: 1 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  statusText: { color: "white", fontWeight: "bold", fontSize: 12 },
  qrSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  qrActiveText: {
    fontWeight: "900",
    color: "#27ae60",
    letterSpacing: 1,
    marginBottom: 5,
  },
  qrCodeWrapper: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tapText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
    textAlign: "center",
  },
  empty: { textAlign: "center", marginTop: 50, color: "#95a5a6", fontSize: 16 },
});
