import { Redirect } from 'expo-router';

export default function Index() {
  // Use static redirect only - no useEffect
  return <Redirect href="/splash" />;
} 