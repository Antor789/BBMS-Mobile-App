import apiClient from "./apiClient";

// --- Authentication ---
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("API Login Error:", error);
    throw error;
  }
};

// --- Bus Pass Request (Fixes 500 Error) ---
export const requestBusPass = async (
  userId: number,
  scheduleId: number,
  routeName: string,
) => {
  try {
    // Including routeName is mandatory for your MySQL table
    const response = await apiClient.post("/bus-pass/request", {
      user_id: userId,
      schedule_id: scheduleId,
      route_name: routeName,
    });
    return response.data;
  } catch (error) {
    console.error("Bus Pass Request Error:", error);
    throw error;
  }
};

// --- Fetch History (Fixes 404 Error) ---
export const getPassHistory = async (userId: number) => {
  try {
    // Matches the alias /api/student/history/:userId in your server.js
    const response = await apiClient.get(`/student/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch History Error:", error);
    throw error;
  }
};
