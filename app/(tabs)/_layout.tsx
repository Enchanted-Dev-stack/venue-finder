import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          // height: 6/0,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          paddingVertical: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="home-outline" 
                size={22} 
                color={focused ? '#3b82f6' : '#94A3B8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="search-outline" 
                size={22} 
                color={focused ? '#3b82f6' : '#94A3B8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="map-outline" 
                size={22} 
                color={focused ? '#3b82f6' : '#94A3B8'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="person-outline" 
                size={22} 
                color={focused ? '#3b82f6' : '#94A3B8'} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  }
});
