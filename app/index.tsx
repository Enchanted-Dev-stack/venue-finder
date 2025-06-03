import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  // Only redirect after loading is complete
  return isAuthenticated() ? 
    <Redirect href="/(tabs)" /> : 
    <Redirect href="/(auth)/login" />;
}