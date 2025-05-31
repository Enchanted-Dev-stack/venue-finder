import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

// Define bottom padding based on platform
const BOTTOM_PADDING = Platform.OS === 'ios' ? 88 : 60;

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user  } = useAuth();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];
  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/ProfileSettings')}
          >
            <Ionicons name="settings-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: user?.profileImage || 'https://i.pravatar.cc/300?img=32' }}
            style={styles.profileImage}
          />
          <Text style={[styles.userName, { color: colors.text }]}>{user?.fullName || "User"}</Text>
          <Text style={[styles.userLocation, { color: colors.textSecondary }]}>{user?.email || "Email"}</Text>
          
          <TouchableOpacity 
            style={[styles.editProfileButton, { borderColor: colors.icon }]}
            onPress={() => router.push('/EditProfile')}
          >
            <Text style={[styles.editProfileText, { color: colors.text }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Bookmarks</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>18</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>36</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Visited</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer]}>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.divider }]}
            onPress={() => router.push('/SavedVenues')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
              <Ionicons name="bookmark-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>Saved Venues</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: colors.divider }]}
            onPress={() => router.push('/MyReviews')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
              <Ionicons name="star-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>My Reviews</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
              <Ionicons name="notifications-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>Recent Activity</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.divider }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.surface : Colors.light.surface }]}>
              <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Theme Switcher */}
        <View style={[styles.themeContainer, { backgroundColor: colors.card }]}>
          <ThemeSwitch />
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.button }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.status.error} />
          <Text style={[styles.logoutText, { color: Colors.status.error }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Venue Finder v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfitsemibold',
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Outfitsemibold',
    marginBottom: Spacing.xs,
  },
  userLocation: {
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    marginBottom: Spacing.lg,
  },
  editProfileButton: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    ...Shadows.light.small,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  menuContainer: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    marginLeft: Spacing.lg,
  },
  themeContainer: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  themeTitle: {
    fontSize: 18,
    fontFamily: 'Outfitmedium',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xxl,
    ...Shadows.light.small,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#ef4444',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
  },
});