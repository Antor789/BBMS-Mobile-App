import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import apiClient from "../../src/api/apiClient";

export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get("/student/notifications/1");
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Notification Error:", error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      {/* --- STUDENT SECTION --- */}
      <Tabs.Screen
        name="(user)/index"
        options={{
          title: "Portal",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(user)/MyPassesScreen"
        options={{
          title: "Passes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "card" : "card-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(user)/apply-pass"
        options={{
          title: "Apply",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* --- DRIVER SECTION --- */}
      <Tabs.Screen
        name="(driver)/ScannerScreen"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="steering" size={24} color={color} />
          ),
        }}
      />

      {/* --- ADMIN SECTION --- */}
      <Tabs.Screen
        name="(admin)/AdminRequestScreen"
        options={{
          title: "Approvals",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "checkmark-done-circle"
                  : "checkmark-done-circle-outline"
              }
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* --- SUPPORT / SHARED --- */}
      <Tabs.Screen
        name="(user)/feedback"
        options={{
          title: "Support",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(user)/UserDashboard" // This MUST match the filename in your explorer
        options={{
          title: "Portal",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "school" : "school-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* --- HIDDEN ROUTES --- */}
      <Tabs.Screen name="(user)/LiveMap" options={{ href: null }} />
      <Tabs.Screen name="(user)/BusScheduleScreen" options={{ href: null }} />
      <Tabs.Screen
        name="(admin)/AdminFeedbackScreen"
        options={{ href: null }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 88 : 72,
    paddingTop: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 12 },
    }),
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: Platform.OS === "ios" ? 0 : 12,
  },
});
