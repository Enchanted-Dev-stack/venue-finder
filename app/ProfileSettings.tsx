import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Moon, Bell, Shield, LogOut } from 'lucide-react-native';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

const ProfileSettings = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];
  
  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} color={colors.icon} />, label: 'Personal Information', screen: 'EditProfile' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} color={colors.icon} />, label: 'Notifications', screen: '' },
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: <Shield size={20} color={colors.icon} />, label: 'Privacy Settings', screen: '' },
      ]
    },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={[styles.settingItem, { borderBottomColor: currentTheme === 'dark' ? '#333' : '#e0e0e0' }]}
                onPress={() => item.screen ? navigation.navigate(item.screen as never) : null}
              >
                <View style={styles.settingItemLeft}>
                  {item.icon}
                  <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Text style={{ color: colors.icon }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        {/* Theme Switch Section */}
        <ThemeSwitch />
        
        {/* Logout Section */}
        <View style={[styles.section, styles.logoutSection]}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#f87171" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Ralewaymedium',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Ralewaysemibold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    marginLeft: 12,
    fontFamily: 'Ralewayregular',
  },
  logoutSection: {
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 15,
    marginLeft: 12,
    fontFamily: 'Ralewaymedium',
  },
});

export default ProfileSettings;
