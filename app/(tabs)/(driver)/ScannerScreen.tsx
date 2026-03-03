import { CameraView, useCameraPermissions } from "expo-camera"; // Updated Import
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import apiClient from "../../../src/api/apiClient";

export default function DriverScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Handle camera permissions
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera access is required to scan passes.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const passData = JSON.parse(data);

      // Verify against your backend at 192.168.1.115
      const res = await apiClient.get(`/admin/pass-requests`);
      const match = res.data.find(
        (p: any) => p.request_id === passData.pass_id,
      );

      if (match && match.status === "Approved") {
        Alert.alert(
          "✅ VALID PASS",
          `User ID: ${match.user_id}\nRoute: ${match.route_name}`,
        );
      } else {
        Alert.alert("❌ INVALID", "This pass is not approved or is inactive.");
      }
    } catch (e) {
      Alert.alert("⚠️ Error", "Invalid QR Code format.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Boarding Scanner</Text>

      <CameraView
        style={styles.scanner}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"], // Set to QR specifically for your bus passes
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay} />
      </CameraView>

      {scanned && (
        <View style={styles.btnContainer}>
          <Button
            title={"Scan Next Passenger"}
            onPress={() => setScanned(false)}
            color="#27ae60"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 40,
  },
  scanner: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 20,
    overflow: "hidden",
  },
  permissionText: { color: "white", textAlign: "center", marginBottom: 20 },
  overlay: {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: "80%",
    height: "50%",
    borderWidth: 2,
    borderColor: "#27ae60",
    borderRadius: 10,
    borderStyle: "dashed",
  },
  btnContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 40,
  },
});
