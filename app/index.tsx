import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import apiClient from "../src/api/apiClient"; //

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = {
    bg: isDarkMode ? "#0F172A" : "#F8FAFC",
    card: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E293B",
    input: isDarkMode ? "#1E293B" : "#F1F5F9",
    border: isDarkMode ? "#334155" : "#E2E8F0",
  };

  const handleForgotPassword = () => {
    Alert.prompt("Reset Password", "Enter email for a recovery link:", [
      { text: "Cancel" },
      {
        text: "Send",
        onPress: async (mail: string | undefined) => {
          try {
            await apiClient.post("/auth/forgot-password", { email: mail });
            Alert.alert("Sent", "Check your inbox for instructions.");
          } catch (e) {
            Alert.alert("Error", "Server unreachable.");
          }
        },
      },
    ]);
  };

  const handleLogin = () => {
    // Navigates based on established project folder structure
    router.replace(
      userRole === "admin"
        ? "/(tabs)/(admin)/AdminRequestScreen"
        : "/(tabs)/(user)/UserDashboard",
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <TouchableOpacity
        style={styles.themeBtn}
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={26}
          color={theme.text}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.logoArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="bus" size={40} color="#007AFF" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>BBMS</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, userRole === "user" && styles.activeTab]}
            onPress={() => setUserRole("user")}
          >
            <Text
              style={[
                styles.tabText,
                userRole === "user" && styles.activeTabText,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, userRole === "admin" && styles.activeTab]}
            onPress={() => setUserRole("admin")}
          >
            <Text
              style={[
                styles.tabText,
                userRole === "admin" && styles.activeTabText,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.inputBox,
            { backgroundColor: theme.input, borderColor: theme.border },
          ]}
        >
          <Ionicons name="mail-outline" size={20} color="#64748B" />
          <TextInput
            placeholder="University Email"
            placeholderTextColor="#64748B"
            style={[styles.input, { color: theme.text }]}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View
          style={[
            styles.inputBox,
            { backgroundColor: theme.input, borderColor: theme.border },
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
          <TextInput
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#64748B"
            style={[styles.input, { color: theme.text }]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  themeBtn: { position: "absolute", top: 60, right: 30 },
  card: { width: width * 0.85, padding: 30, borderRadius: 30, borderWidth: 1 },
  logoArea: { alignItems: "center", marginBottom: 30 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  title: { fontSize: 28, fontWeight: "900", marginTop: 15 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#334155" },
  tabText: { color: "#94A3B8", fontWeight: "700" },
  activeTabText: { color: "white" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
  },
  input: { flex: 1, marginLeft: 10 },
  forgot: {
    color: "#007AFF",
    textAlign: "right",
    fontWeight: "700",
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: "#007AFF",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
