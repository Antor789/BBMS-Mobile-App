import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import MapView, {
  AnimatedRegion,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import apiClient from "../../../src/api/apiClient";

export default function LiveMap() {
  const mapRef = useRef<MapView>(null);
  const [busData, setBusData] = useState<any>(null);

  // 1. Animated coordinate for smooth gliding
  const [animatedCoord] = useState(
    new AnimatedRegion({
      latitude: 23.8103,
      longitude: 90.4125,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  );

  const fetchLocation = async () => {
    try {
      const response = await apiClient.get("/bus/live-status/1");
      const { latitude, longitude } = response.data;

      // 2. Animate the bus to the new position over 2 seconds
      animatedCoord
        .timing({
          latitude: Number(latitude),
          longitude: Number(longitude),
          duration: 2000,
          useNativeDriver: false,
          toValue: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        })
        .start();

      setBusData(response.data);
    } catch (error) {
      console.error("GPS Sync Error:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchLocation, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. Camera following logic
  useEffect(() => {
    if (busData && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: Number(busData.latitude),
          longitude: Number(busData.longitude),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    }
  }, [busData]);

  if (!busData)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Connecting to Bus...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map}>
        <MarkerAnimated coordinate={animatedCoord} anchor={{ x: 0.5, y: 0.5 }}>
          <Image
            source={require("../../../assets/images/bus-top-view.png")} // Fixed path
            style={{
              width: 48,
              height: 48,
              resizeMode: "contain",
              transform: [{ rotate: `${busData.heading || 0}deg` }],
            }}
          />
        </MarkerAnimated>
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <Text style={styles.busTitle}>{busData.bus_name}</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.routeText}>{busData.route_name}</Text>
        <Text style={styles.speedText}>
          ⚡ {Math.round(busData.speed)} km/h
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoCard: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  liveBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  liveText: { color: "#EF4444", fontSize: 10, fontWeight: "bold" },
  busTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  routeText: { color: "#64748B", fontSize: 13, marginTop: 2 },
  speedText: {
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 16,
  },
});
