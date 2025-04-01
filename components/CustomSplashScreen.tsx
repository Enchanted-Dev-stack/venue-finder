import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const CustomSplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    console.log('CustomSplashScreen mounted');
    
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Set a timeout to navigate to home screen after 4 seconds
    const timer = setTimeout(() => {
      console.log('CustomSplashScreen timer fired, starting fade out');
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        console.log('CustomSplashScreen fade out complete, navigating to login');
        // Navigate to login screen after animation ends
        if (isAuthenticated()) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      });
    }, 4000);

    return () => {
      console.log('CustomSplashScreen unmounted, clearing timer');
      clearTimeout(timer);
    }
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animatable.Text
          animation="fadeIn"
          duration={800}
          delay={400}
          style={styles.title}
        >
          Venue Finder
        </Animatable.Text>
        <Animatable.View
          animation="fadeIn"
          duration={800}
          delay={600}
          style={styles.loadingBar}
        >
          <Animatable.View
            animation="slideRightIn"
            duration={1000}
            delay={700}
            style={styles.progress}
          />
        </Animatable.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserratbold',
    color: '#333',
    marginBottom: 30,
  },
  loadingBar: {
    width: width * 0.7,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 4,
  },
});

export default CustomSplashScreen; 