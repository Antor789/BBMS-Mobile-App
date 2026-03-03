import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import apiClient from "../../../src/api/apiClient";

export default function ApplyPassScreen() {
  const [scheduleId, setScheduleId] = useState("");

  const handleSubmitRequest = async () => {
    // Dismiss the keyboard immediately when the button is pressed
    Keyboard.dismiss();

    if (!scheduleId)
      return Alert.alert("Error", "Please enter a valid Schedule ID.");

    try {
      await apiClient.post("/bus-pass/request", {
        user_id: 1, // Test user_id
        schedule_id: parseInt(scheduleId),
      });

      Alert.alert(
        "Success",
        "Your bus pass request has been submitted to the admin!",
      );
      setScheduleId("");
    } catch (error) {
      Alert.alert("Error", "Could not submit request.");
    }
  };

  return (
    // Wrap the entire view in TouchableWithoutFeedback to dismiss keyboard on tap outside
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>Request New Bus Pass</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Schedule ID (e.g., 1)"
          value={scheduleId}
          onChangeText={setScheduleId}
          keyboardType="numeric" // Triggers the numeric pad
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss} // Dismisses when "Done" is pressed
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmitRequest}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
