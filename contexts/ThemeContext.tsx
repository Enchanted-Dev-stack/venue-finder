import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark'; // The actual theme being applied (resolves 'system')
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  currentTheme: 'dark',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = '@venue-finder:theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Resolve the current theme (if system, use device theme)
  const currentTheme = theme === 'system' ? deviceTheme : theme;
  
  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
