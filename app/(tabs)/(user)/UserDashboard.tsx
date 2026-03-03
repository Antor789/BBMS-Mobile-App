import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";

export default function UserDashboard() {
  const router = useRouter();
  const [busStatus, setBusStatus] = useState<any>(null);

  // Fetch real-time bus optimization data from backend
  useEffect(() => {
    const fetchBusData = async () => {
      try {
        // Reaching the backend via your ngrok tunnel
        const response = await apiClient.get("/bus/status");
        setBusStatus(response.data);
      } catch (error) {
        console.error("Failed to fetch bus optimization data", error);
      }
    };

    fetchBusData();
    // Optional: Poll every 10 seconds for live updates
    const interval = setInterval(fetchBusData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out of BBMS?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.title}>Student Portal</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        {/* Card 1: Apply for Pass */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/(user)/apply-pass")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
            <Ionicons name="bus" size={28} color="#007AFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Apply for Bus Pass</Text>
            <Text style={styles.cardSubtitle}>
              Request your digital transit ID
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Card 2: My Passes */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/(user)/MyPassesScreen")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="card" size={28} color="#9C27B0" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>My Passes</Text>
            <Text style={styles.cardSubtitle}>
              View and show your active passes
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Card 3: Live Bus Tracking */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/(user)/LiveMap")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFF5E6" }]}>
            <Ionicons name="navigate" size={28} color="#FF9500" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Live Bus Tracking</Text>
            <Text style={styles.cardSubtitle}>
              View real-time location of buses
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Card 4: Feedback */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(tabs)/(user)/feedback")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="chatbubbles" size={28} color="#2E7D32" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Submit Feedback</Text>
            <Text style={styles.cardSubtitle}>
              Report issues or suggestions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Optimization Card: Live Seat Count - NOW DYNAMIC */}
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: "#E0F7FA" }]}>
            <Ionicons name="people" size={28} color="#00ACC1" />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Live Occupancy</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: "#FFF9C4" }]}
              >
                <Text style={[styles.statusText, { color: "#FBC02D" }]}>
                  {busStatus
                    ? `${busStatus.available_seats} Seats Left`
                    : "Loading..."}
                </Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              {busStatus
                ? `Bus #${busStatus.bus_number}`
                : "Connecting to server..."}
            </Text>

            {/* Visual Progress Bar for Optimization */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: busStatus
                      ? `${(busStatus.occupied_seats / busStatus.total_seats) * 100}%`
                      : "0%",
                    backgroundColor:
                      busStatus &&
                      busStatus.occupied_seats / busStatus.total_seats > 0.8
                        ? "#FF3B30"
                        : "#007AFF",
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Optimization Card: Smart Load Balancing */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            Alert.alert(
              "Optimization Suggestion",
              busStatus?.recommendation ||
                "Checking for the most comfortable travel times...",
            )
          }
        >
          <View style={[styles.iconBox, { backgroundColor: "#F1F8E9" }]}>
            <Ionicons name="trending-up" size={28} color="#43A047" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Smart Suggestion</Text>
            <Text style={styles.cardSubtitle}>
              View optimized timings for your route
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  welcomeText: { fontSize: 14, color: "#8E8E93", fontWeight: "500" },
  title: { fontSize: 26, fontWeight: "800", color: "#1C1C1E", marginTop: 2 },
  logoutButton: { padding: 10, backgroundColor: "#FFF2F2", borderRadius: 12 },
  menuGrid: { padding: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#1C1C1E" },
  cardSubtitle: { fontSize: 13, color: "#8E8E93", marginTop: 3 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
});
