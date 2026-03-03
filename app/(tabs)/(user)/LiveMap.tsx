import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import apiClient from "../../../src/api/apiClient"; //

export default function LiveMap() {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [busData, setBusData] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    route_name: "Detecting Route...",
    bus_number: "Dhaka-101",
  });

  // Real-time polling logic
  useEffect(() => {
    const fetchBusLocation = async () => {
      try {
        // Fetching from your 'bus_locations' table
        const response = await apiClient.get("/bus/location/Dhaka-101");
        if (response.data) {
          setBusData({
            latitude: parseFloat(response.data.latitude),
            longitude: parseFloat(response.data.longitude),
            route_name: response.data.route_name,
            bus_number: response.data.bus_number || "Dhaka-101",
          });
        }
      } catch (error) {
        console.error("Map Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusLocation();
    const interval = setInterval(fetchBusLocation, 4000); // Polling every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const recenterMap = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: busData.latitude,
        longitude: busData.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000,
    );
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: busData.latitude,
          longitude: busData.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapStyle}
      >
        <Marker
          coordinate={{
            latitude: busData.latitude,
            longitude: busData.longitude,
          }}
        >
          <View style={styles.busMarker}>
            <Ionicons name="bus" size={20} color="white" />
          </View>
          <Callout tooltip>
            <View style={styles.callout}>
              <Text style={styles.bold}>Bus: {busData.bus_number}</Text>
              <Text style={styles.calloutSub}>Live Tracking Active</Text>
            </View>
          </Callout>
        </Marker>
        <Marker
          coordinate={{ latitude: 23.8103, longitude: 90.4125 }} // Example coordinates
          title="Bus #04"
        >
          <View style={styles.mapIconCircle}>
            <Ionicons name="bus" size={20} color="white" />
          </View>

          {/* The optimization overlay bubble */}
          <Callout tooltip>
            <View style={styles.mapBubble}>
              <Text style={styles.bubbleTitle}>Bus #04</Text>
              <Text style={styles.bubbleText}>Seats: 28/40</Text>
              <Text style={styles.bubbleText}>Status: Moving</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.fab} onPress={recenterMap}>
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.statusCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.statusTitle}>{busData.route_name}</Text>
            <View style={styles.liveBadge}>
              <View style={styles.dot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.statusSub}>Tap marker for driver details</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: "center" },
  map: { width: "100%", height: "100%" },
  busMarker: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    elevation: 5,
  },
  overlay: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  fab: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    alignSelf: "flex-end",
    elevation: 5,
  },
  statusCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 22,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTitle: { fontWeight: "bold", fontSize: 18, color: "#1E293B" },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    marginRight: 5,
  },
  liveText: { fontSize: 10, fontWeight: "800", color: "#EF4444" },
  statusSub: { color: "#64748B", marginTop: 4, fontSize: 13 },
  callout: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    width: 160,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calloutSub: { fontSize: 11, color: "#64748B" },
  bold: { fontWeight: "bold", color: "#1E293B" },
  // Add these missing properties to fix LiveMap errors
  mapIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  mapBubble: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: 120,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bubbleTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 12,
    color: "#64748B",
  },
});

const mapStyle: any[] = [];
