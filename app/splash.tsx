import CustomSplashScreen from '@/components/CustomSplashScreen';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    console.log('SplashScreen route component mounted');
  }, []);

  return <CustomSplashScreen />;
} 