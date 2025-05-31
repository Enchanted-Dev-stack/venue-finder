import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, PanResponder, Animated } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";

import AboutTab from "./AboutTab";
import MenuTab from "./MenuTab";
import ReviewsTab from "./ReviewsTab";
import PhotosTab from "./PhotosTab";

interface Venue {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  capacity: number;
  phone: string;
  email: string;
  website: string;
  location: {
    coordinates: number[];
    city: string;
    zipcode: string;
    type: string;
  };
  media: {
    images: string[];
    hasPromoVideo: boolean;
    promoVideoUrl: string;
    has360Tour: boolean;
    tour360Url: string;
  };
  amenities: string[];
  eventTypes: string[];
  cateringOptions: string;
  pricing: string;
  pricingMenu: any[];
  packages: any[];
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  operatingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  reviewCount: number;
  averageRating: number;
  isVerified: boolean;
  acceptingBookings: boolean;
}

interface TabNavigatorProps {
  venue: Venue;
  initialHeight: number;
}

const Tab = createMaterialTopTabNavigator();

const TabNavigator = ({ venue, initialHeight }: TabNavigatorProps) => {
  const [expanded, setExpanded] = useState(false);
  const [tabHeight, setTabHeight] = useState(initialHeight);
  const expandAnimation = useRef(new Animated.Value(0)).current;
  // Store the current value in a ref to avoid TypeScript errors
  const animationValueRef = useRef(0);
  
  // Add a listener to track the animation value
  useEffect(() => {
    const id = expandAnimation.addListener(({ value }) => {
      animationValueRef.current = value;
    });
    
    return () => expandAnimation.removeListener(id);
  }, []);
  const { height: windowHeight } = Dimensions.get("window");
  const maxHeight = windowHeight - 100; // Leave space for status bar and some margin
  
  // Threshold for expanding/collapsing
  const expandThreshold = 50;
  
  // Handle the pan gesture for expanding and collapsing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        // Use the stored value from our ref instead of direct access
        expandAnimation.setOffset(animationValueRef.current);
      },
      onPanResponderMove: (_, gestureState) => {
        // Limit the drag to not go below the initial height or above maxHeight
        const newValue = Math.max(
          0,
          Math.min(maxHeight - initialHeight, gestureState.dy)
        );
        expandAnimation.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        expandAnimation.flattenOffset();
        
        // Expand or collapse based on gesture velocity and distance
        if (gestureState.dy < -expandThreshold || 
            (gestureState.vy < -0.5 && gestureState.dy < 0)) {
          // Expand
          Animated.spring(expandAnimation, {
            toValue: maxHeight - initialHeight,
            useNativeDriver: false,
            tension: 40,
            friction: 8
          }).start(() => setExpanded(true));
        } else if (gestureState.dy > expandThreshold || 
                  (gestureState.vy > 0.5 && gestureState.dy > 0)) {
          // Collapse
          Animated.spring(expandAnimation, {
            toValue: 0,
            useNativeDriver: false,
            tension: 40,
            friction: 8
          }).start(() => setExpanded(false));
        } else {
          // Return to previous state
          Animated.spring(expandAnimation, {
            toValue: expanded ? (maxHeight - initialHeight) : 0,
            useNativeDriver: false,
            tension: 40,
            friction: 8
          }).start();
        }
      }
    })
  ).current;

  // Calculate the current height based on animation value
  const currentHeight = expandAnimation.interpolate({
    inputRange: [0, maxHeight - initialHeight],
    outputRange: [initialHeight, maxHeight],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={[styles.container, { height: currentHeight }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.dragIndicator} />
      {/* Use the Tab.Navigator directly without wrapping it in a NavigationContainer */}
      <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#3b82f6",
            tabBarInactiveTintColor: "#6b7280",
            tabBarIndicatorStyle: { backgroundColor: "#3b82f6", height: 3 },
            tabBarStyle: { 
              elevation: 0, 
              shadowOpacity: 0, 
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            tabBarLabelStyle: { 
              fontSize: 14, 
              fontWeight: "600", 
              textTransform: "none"
            },
          }}
        >
          <Tab.Screen 
            name="About" 
            children={() => <AboutTab venue={venue} expanded={expanded} />} 
          />
          <Tab.Screen 
            name="Menu" 
            children={() => <MenuTab venue={venue} expanded={expanded} />} 
          />
          <Tab.Screen 
            name="Reviews" 
            children={() => <ReviewsTab venue={venue} expanded={expanded} />} 
          />
          <Tab.Screen 
            name="Photos" 
            children={() => <PhotosTab venue={venue} expanded={expanded} />} 
          />
        </Tab.Navigator>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  }
});

export default TabNavigator;
