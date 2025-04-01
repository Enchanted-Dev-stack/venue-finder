import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Colors } from '@/constants/Colors';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Setup the pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Auto-hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish, pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Background circle */}
        <Animatable.View 
          animation="fadeIn"
          duration={500}
          style={styles.backgroundCircle}
        />
        
        {/* Main logo with zoom and pulse */}
        <Animatable.View 
          animation="zoomIn" 
          duration={800}
          style={styles.logoContainer}
        >
          <Animated.Image 
            source={require('../../assets/images/splash-icon.png')} 
            style={[
              styles.logo,
              { transform: [{ scale: pulseAnim }] }
            ]} 
            resizeMode="contain"
          />
        </Animatable.View>
        
        {/* App title with fade in */}
        <Animatable.Text
          animation="fadeIn"
          delay={400}
          duration={800}
          style={styles.title}
        >
          Venue Finder
        </Animatable.Text>
        
        {/* Tagline with fade in */}
        <Animatable.Text
          animation="fadeIn"
          delay={800}
          duration={800}
          style={styles.subtitle}
        >
          Find the perfect venue for you
        </Animatable.Text>
        
        {/* Loading indicator */}
        <Animatable.View
          animation="fadeIn"
          delay={600}
          duration={400}
          style={styles.loadingBar}
        >
          <Animatable.View 
            animation="slideRightIn" 
            duration={1500}
            style={styles.loadingProgress} 
          />
        </Animatable.View>
      </View>
    </View>
  );
}

// Define custom animations
Animatable.initializeRegistryWithDefinitions({
  slideRightIn: {
    from: { translateX: -100 },
    to: { translateX: 0 },
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(230, 230, 250, 0.3)',
    zIndex: -1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Outfitbold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Outfitmedium',
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingBar: {
    width: width * 0.7,
    height: 6,
    backgroundColor: '#eaeaea',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#6c63ff',
    borderRadius: 3,
  },
}); 