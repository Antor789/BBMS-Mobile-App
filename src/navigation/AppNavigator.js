import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Shared/LoginScreen";
// We will create these screens next
import AdminDashboard from "../screens/Admin/AdminDashboard";
import UserDashboard from "../screens/User/UserDashboard";

const Stack = createStackNavigator();

export default function AppNavigator({ userRole }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole == null ? (
        // Authentication & RBAC Module (FR-1..4)
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : userRole === "admin" ? (
        // Admin Module (FR-5..14)
        <Stack.Screen name="AdminHome" component={AdminDashboard} />
      ) : (
        // Student/Staff Module (FR-19..26)
        <Stack.Screen name="UserHome" component={UserDashboard} />
      )}
    </Stack.Navigator>
  );
}
