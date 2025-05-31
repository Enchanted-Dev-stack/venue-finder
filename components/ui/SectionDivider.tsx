import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface SectionDividerProps {
  title: string;
}

/**
 * A reusable section divider component with fading lines on both sides of centered text.
 * Used to visually separate different sections of content.
 */
const SectionDivider = ({ title }: SectionDividerProps) => {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];
  
  // Gradient colors based on theme
  const startColor = currentTheme === 'dark' ? 'rgba(20, 20, 20, 0)' : 'rgba(240, 240, 240, 0)';
  const endColor = currentTheme === 'dark' ? 'rgba(120, 120, 120, 0.5)' : 'rgba(180, 180, 180, 0.5)';
  
  return (
    <View style={styles.sectionDivider}>
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.dividerLine}
      />
      <Text style={[styles.dividerText, { color: colors.text }]}>{title}</Text>
      <LinearGradient
        colors={[endColor, startColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.dividerLine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default SectionDivider;
