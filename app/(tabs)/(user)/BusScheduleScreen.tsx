import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient"; // Uses your updated 192.168.1.116 client

interface ScheduleItem {
  schedule_id: number;
  route_name: string;
  departure_time: string;
  status: string;
  bus_number: string;
  driver_name: string;
}

export default function BusScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(""); // State for timestamp

  // Function to fetch data from the backend
  const fetchSchedules = async (isAutoRefresh = false) => {
    try {
      // Hits http://192.168.1.116:5000/api/bus-schedule
      const response = await apiClient.get("/bus-schedule");
      setSchedules(response.data);

      // Update the timestamp on every successful fetch
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    } catch (error) {
      console.error("Schedule Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSchedules();
  }, []);

  // AUTO-REFRESH LOGIC
  useEffect(() => {
    // Initial fetch when component mounts
    fetchSchedules();

    // Set interval to refresh every 30 seconds (30000ms)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing bus schedule...");
      fetchSchedules(true);
    }, 30000);

    // CLEANUP: Stop the timer when the user leaves this screen
    return () => clearInterval(intervalId);
  }, []);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Live Bus Schedule</Text>
        <View style={styles.updateContainer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.lastUpdatedText}> Updated: {lastUpdated}</Text>
        </View>
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.schedule_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.route}>{item.route_name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "On Time" ? "#eefaf3" : "#fdf2f2",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: item.status === "On Time" ? "#27ae60" : "#e74c3c",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={styles.info}>
              Bus: {item.bus_number} | Driver: {item.driver_name}
            </Text>

            <View style={styles.timeRow}>
              <Ionicons name="calendar-outline" size={16} color="#444" />
              <Text style={styles.time}> Departure: {item.departure_time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No buses scheduled. Pull down to refresh.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  updateContainer: { flexDirection: "row", alignItems: "center" },
  lastUpdatedText: { fontSize: 12, color: "#666" },
  card: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  route: { fontSize: 18, fontWeight: "bold", color: "#007AFF", flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "bold" },
  info: { fontSize: 14, color: "#777", marginVertical: 6 },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  time: { fontSize: 15, fontWeight: "600", color: "#333" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#999" },
});
