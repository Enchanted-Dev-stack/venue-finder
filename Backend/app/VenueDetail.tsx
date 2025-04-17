"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker } from 'react-native-maps';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { StatusBar } from 'expo-status-bar'

import VenueCard from "@/components/VenueCard"
import VenueMenu from "@/components/Venue/VenueMenu"

function MenuTab({ venue }: { venue: Venue }) {
  return <VenueMenu venueId={venue._id} />;
}

// ... rest of the file 