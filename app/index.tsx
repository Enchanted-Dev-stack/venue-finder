import { Redirect } from "expo-router";

// This is just a fallback in case someone navigates directly to /index
// The splash screen in the layout will handle the initial routing
export default function Index() {
  // Simple redirect to tabs - the auth check in the root layout
  // will handle redirecting to login if needed
  return <Redirect href="/(tabs)" />;
} 