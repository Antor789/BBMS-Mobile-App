import apiClient from "./apiClient";

/**
 * Sends login credentials to the MySQL database via the Node.js backend.
 * FIX: Added ': string' type annotations to satisfy TypeScript.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/login", { email, password });
    return response.data; // This returns the user role from your 'Users' table
  } catch (error) {
    console.error("API Login Error:", error);
    throw error;
  }
};
