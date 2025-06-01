import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Theme colors
  const themeColors = {
    tabBarBackground: colorScheme === 'dark' ? '#1a1a1a' : 'white',
    tabBarBorder: colorScheme === 'dark' ? '#333333' : '#F3F4F6',
    tabBarActive: '#3b82f6', // Keep blue for both themes
    tabBarInactive: colorScheme === 'dark' ? '#8899AA' : '#94A3B8',
    labelStyle: colorScheme === 'dark' ? { color: '#ffffff' } : undefined,
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: themeColors.tabBarActive,
        tabBarInactiveTintColor: themeColors.tabBarInactive,
        tabBarLabelStyle: themeColors.labelStyle,
        tabBarStyle: {
          // height: 60,
          backgroundColor: themeColors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: themeColors.tabBarBorder,
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
                color={focused ? themeColors.tabBarActive : themeColors.tabBarInactive} 
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
                color={focused ? themeColors.tabBarActive : themeColors.tabBarInactive} 
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
                color={focused ? themeColors.tabBarActive : themeColors.tabBarInactive} 
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
                color={focused ? themeColors.tabBarActive : themeColors.tabBarInactive} 
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
