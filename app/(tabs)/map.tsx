"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import MapView, { Region, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import Venuedata from "@/data/venues.json"
import { Ionicons } from "@expo/vector-icons"

// Define marker colors for different venue types
const markerColors = {
  cafe: "#FF8C00",      // Orange
  gaming_zone: "#FF0000", // Red
  openspace: "#228B22",  // Forest Green
  chillzone: "#9932CC",  // Purple
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region | undefined>(undefined)
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    let isMounted = true

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        
        if (status !== 'granted') {
          console.log('Permission to access location was denied')
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        console.log('Initial location retrieved:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
        
        if (isMounted) {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
          setInitialRegion(newRegion)
          setRegion(newRegion)
        }
      } catch (error) {
        console.error('Error getting location:', error)
      }
    }

    getLocation()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
      >
        {/* User's location marker */}
        {region && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude
            }}
            title="You are here"
            description="Your current location"
            pinColor="#2196F3"
          />
        )}

        {/* Venue markers */}
        {Venuedata.venues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{
              latitude: venue.coordinates.latitude,
              longitude: venue.coordinates.longitude
            }}
            title={venue.name}
            description={`${venue.type} • ₹${venue.pricePerPerson} per person`}
          >
              <View style={styles.markerContent}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${markerColors[venue.type as keyof typeof markerColors]}15` }
                ]}>
                  {venue.type === "cafe" ? (
                    <Ionicons name="cafe" size={20} color={markerColors.cafe} />
                  ) : venue.type === "gaming_zone" ? (
                    <Ionicons name="game-controller" size={20} color={markerColors.gaming_zone} />
                  ) : venue.type === "openspace" ? (
                    <Ionicons name="leaf" size={20} color={markerColors.openspace} />
                  ) : (
                    <Ionicons name="home" size={20} color={markerColors.chillzone} />
                  )}
                </View>
                <View style={styles.markerInfo}>
                  <Text style={styles.venueName} numberOfLines={1}>
                    {venue.name}
                  </Text>
                  <Text style={styles.venueDetails} numberOfLines={1}>
                    {venue.type.replace('_', ' ')}
                  </Text>
                  <Text style={styles.priceTag}>
                    {venue.pricePerPerson === 0 ? 'Free' : `₹${venue.pricePerPerson}/person`}
                  </Text>
                </View>
              </View>
          </Marker>
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markerInfo: {
    maxWidth: 120,
  },
  venueName: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#1f2937',
  },
  venueDetails: {
    fontSize: 10,
    fontFamily: 'Handjet',
    color: '#6b7280',
    marginTop: 2,
  },
  priceTag: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '500',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
})