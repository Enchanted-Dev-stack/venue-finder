import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun, Smartphone } from 'lucide-react-native';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

const ThemeSwitch = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  
  const themeOptions: { type: ThemeType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'light',
      label: 'Light',
      icon: <Sun size={20} color={theme === 'light' ? Colors[currentTheme].tint : Colors[currentTheme].icon} />
    },
    {
      type: 'dark',
      label: 'Dark',
      icon: <Moon size={20} color={theme === 'dark' ? Colors[currentTheme].tint : Colors[currentTheme].icon} />
    },
    {
      type: 'system',
      label: 'System',
      icon: <Smartphone size={20} color={theme === 'system' ? Colors[currentTheme].tint : Colors[currentTheme].icon} />
    }
  ];
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[currentTheme].text }]}>Appearance</Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity 
            key={option.type}
            style={[
              styles.optionButton,
              { 
                backgroundColor: theme === option.type ? 
                  (currentTheme === 'dark' ? '#2a2a2a' : '#f0f0f0') : 
                  'transparent',
                borderColor: theme === option.type ? Colors[currentTheme].tint : 'transparent'
              }
            ]}
            onPress={() => setTheme(option.type)}
          >
            <View style={styles.optionContent}>
              {option.icon}
              <Text 
                style={[
                  styles.optionText, 
                  { 
                    color: theme === option.type ? 
                      Colors[currentTheme].tint : 
                      Colors[currentTheme].text,
                    fontFamily: 'Ralewayregular'
                  }
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    paddingVertical: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Ralewaymedium',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  optionContent: {
    alignItems: 'center',
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default ThemeSwitch;
