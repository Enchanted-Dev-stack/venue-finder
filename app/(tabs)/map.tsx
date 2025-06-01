"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, Animated } from "react-native"
import MapView, { Region, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import * as Location from "expo-location"
import Venuedata from "@/data/venues.json"
import { Ionicons } from "@expo/vector-icons"
import Constants from "expo-constants"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import bottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet"
import VenueCard from "@/components/map/VenueCard"

// Define marker colors for different venue types
const markerColors = {
  cafe: "#FF8C00",      // Orange
  gaming_zone: "#FF0000", // Red
  openspace: "#228B22",  // Forest Green
  chillzone: "#9932CC",  // Purple
}

// Use the API key directly from .env
const GOOGLE_MAPS_API_KEY = "AIzaSyBIXQAlqY90RD35r1Oltebzszf_bVQoijI";

// Debug flag - set to true to see detailed logs
const DEBUG = true;

export default function MapScreen() {
  const colorScheme = useColorScheme()
  // Add loading and permission states
  const [isLoading, setIsLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'requesting'>('requesting')
  const [region, setRegion] = useState<Region | undefined>(undefined)
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [isDetailedView, setIsDetailedView] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // State for location tracking and directions
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<typeof Venuedata.venues[0] | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [directionsError, setDirectionsError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  
  // Create separate animation values for each view
  const cardViewOpacity = useRef(new Animated.Value(isDetailedView ? 1 : 0)).current
  const listViewOpacity = useRef(new Animated.Value(isDetailedView ? 0 : 1)).current
  
  // Handle animation when view type changes
  useEffect(() => {
    // If this isn't the initial render and we're animating
    if (isAnimating) {
      // Determine which view is now active and should fade in
      const activeAnim = isDetailedView ? cardViewOpacity : listViewOpacity
      
      // Fade in the new active view
      Animated.timing(activeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false)
      })
    }
  }, [isDetailedView])
  
  // Toggle view with animation
  const toggleView = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    // Determine which view is currently active and should fade out
    const currentAnim = isDetailedView ? cardViewOpacity : listViewOpacity
    
    // Fade out current view
    Animated.timing(currentAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Switch view type
      setIsDetailedView(!isDetailedView)
      
      // Fade in new view after switching
      Animated.timing(
        !isDetailedView ? cardViewOpacity : listViewOpacity, 
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ).start(() => {
        setIsAnimating(false)
      })
    })
  }
  
  // Theme colors
  const themeColors = {
    background: colorScheme === 'dark' ? '#121212' : '#fff',
    cardBackground: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
    text: colorScheme === 'dark' ? '#ffffff' : '#1f2937',
    textSecondary: colorScheme === 'dark' ? '#dadada' : '#6b7280',
    border: colorScheme === 'dark' ? '#333333' : '#f3f4f6',
    toggleButton: colorScheme === 'dark' ? '#333333' : '#f3f4f6',
    icon: colorScheme === 'dark' ? '#dadada' : '#6b7280',
    bottomSheetHandle: colorScheme === 'dark' ? '#555555' : '#A0AEC0'
  }

  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], [])
  const mapRef = useRef<MapView>(null)

  // Request location permissions function
  const requestLocationPermission = async () => {
    setLocationPermission('requesting');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission('granted');
        startLocationTracking();
      } else {
        setLocationPermission('denied');
        setIsLoading(false);
        console.log('Permission to access location was denied');
      }
    } catch (error) {
      setLocationPermission('denied');
      setIsLoading(false);
      console.error('Error requesting location permission:', error);
    }
  };

  // Start location tracking function
  const startLocationTracking = async () => {
    try {
      setIsLoading(true);
      
      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      };
      setInitialRegion(newRegion);
      setRegion(newRegion);
      
      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,  // Update every 5 seconds
          distanceInterval: 10, // Update if moved by 10 meters
        },
        (updatedLocation) => {
          const newRegion = {
            latitude: updatedLocation.coords.latitude,
            longitude: updatedLocation.coords.longitude,
            latitudeDelta: region?.latitudeDelta || 0.0122,
            longitudeDelta: region?.longitudeDelta || 0.0121,
          };
          setRegion(newRegion);
        }
      );
      
      setLocationSubscription(subscription);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error setting up location tracking:', error);
      setIsLoading(false);
    }
  };

  // Check location permission on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (isMounted) {
          if (status === 'granted') {
            setLocationPermission('granted');
            startLocationTracking();
          } else {
            setLocationPermission('denied');
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setLocationPermission('denied');
          setIsLoading(false);
          console.error('Error checking location permission:', error);
        }
      }
    };
    
    checkPermission();
    
    return () => {
      isMounted = false;
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Handle when a venue is selected for directions
  const selectVenueForDirections = (venue: typeof Venuedata.venues[0]) => {
    if (DEBUG) console.log('Selecting venue for directions:', venue.name);
    
    // Reset previous errors and distance/duration
    setDirectionsError(null);
    setDistance(null);
    setDuration(null);
    setIsUsingFallback(false);
    
    setSelectedVenue(venue);
    setShowDirections(true);
    
    // Fit map to show both user location and venue
    if (region) {
      const edgePadding = { top: 100, right: 100, bottom: 300, left: 100 };
      
      if (DEBUG) console.log('Fitting map to coordinates:', {
        user: { lat: region.latitude, lng: region.longitude },
        venue: { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude }
      });
      
      mapRef.current?.fitToCoordinates(
        [
          { latitude: region.latitude, longitude: region.longitude },
          { latitude: venue.coordinates.latitude, longitude: venue.coordinates.longitude }
        ],
        { edgePadding, animated: true }
      );
    }
    
    // Collapse bottom sheet to first snap point
    bottomSheetRef.current?.snapToIndex(0);
  }
  
  // Focus map on venue without showing directions
  const focusMapOnVenue = (latitude: number, longitude: number) => {
    // Animate map to venue location
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000)

    // Collapse bottom sheet
    bottomSheetRef.current?.snapToIndex(0)
    
    // Clear any active directions
    setShowDirections(false)
    setSelectedVenue(null)
  }
  
  // Handle route calculation results
  const onDirectionsReady = (result: any) => {
    if (DEBUG) console.log('Directions ready with result:', result);
    setDistance(result.distance);
    setDuration(result.duration);
    setIsUsingFallback(false);
  }
  
  // Calculate straight-line distance when a venue is selected
  useEffect(() => {
    if (showDirections && selectedVenue && region) {
      // Calculate distance in km using Haversine formula
      const calculateDistance = () => {
        const lat1 = region.latitude;
        const lon1 = region.longitude;
        const lat2 = selectedVenue.coordinates.latitude;
        const lon2 = selectedVenue.coordinates.longitude;
        
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        
        // Update distance state
        setDistance(distance);
        
        // Estimate duration (very rough estimate: 3 minutes per km)
        setDuration(distance * 3);
      };
      
      calculateDistance();
    }
  }, [showDirections, selectedVenue, region]);

  return (
    <View style={styles.container}>
      {/* Loading Overlay */}
      {isLoading && (
        <View style={[styles.overlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
          <View style={[styles.loadingCard, { backgroundColor: themeColors.cardBackground }]}>
            <Ionicons name="locate-outline" size={32} color={themeColors.icon} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>Detecting your location...</Text>
          </View>
        </View>
      )}
      
      {/* Location Permission Request UI */}
      {!isLoading && locationPermission === 'denied' && (
        <View style={[styles.overlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)' }]}>
          <View style={[styles.permissionCard, { backgroundColor: themeColors.cardBackground }]}>
            <Ionicons name="location-outline" size={48} color={themeColors.icon} />
            <Text style={[styles.permissionTitle, { color: themeColors.text }]}>Location Access Required</Text>
            <Text style={[styles.permissionText, { color: themeColors.textSecondary }]}>
              Venue Finder needs access to your location to show nearby venues and provide directions.
            </Text>
            <TouchableOpacity 
              style={[styles.permissionButton, { backgroundColor: '#3b82f6' }]}
              onPress={requestLocationPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Location Access</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <MapView 
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={!selectedVenue}
      >
        {/* User's location marker - replaced with showsUserLocation */}
        
        {/* Directions between user and selected venue */}
        {showDirections && selectedVenue && region && (
          <>
            {/* Try Google Maps Directions first */}
            <MapViewDirections
              origin={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
              destination={{
                latitude: selectedVenue.coordinates.latitude,
                longitude: selectedVenue.coordinates.longitude
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor={colorScheme === 'dark' ? "#3b82f6" : "#2196F3"}
              onReady={onDirectionsReady}
              onError={(errorMessage) => {
                if (DEBUG) console.log('Directions API error details:', errorMessage);
                setDirectionsError(errorMessage);
                setIsUsingFallback(true);
              }}
              mode="DRIVING"
              precision="high"
              timePrecision="now"
            />
            
            {/* Show fallback line if there's an error with Directions API */}
            {isUsingFallback && (
              <Polyline
                coordinates={[
                  {
                    latitude: region.latitude,
                    longitude: region.longitude
                  },
                  {
                    latitude: selectedVenue.coordinates.latitude,
                    longitude: selectedVenue.coordinates.longitude
                  }
                ]}
                strokeWidth={4}
                strokeColor={colorScheme === 'dark' ? "#ff9800" : "#ff9800"}
                lineDashPattern={[1, 3]}
              />
            )}
          </>
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
      <TouchableOpacity 
        style={styles.locateMeButton}
        onPress={() => {
          if (region) {
            mapRef.current?.animateToRegion({
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }, 500);
          }
        }}
      >
        <View style={[styles.locateMeButtonInner, { 
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }]}>
          <Ionicons name="locate" size={22} color={colorScheme === 'dark' ? "#fff" : "#000"} />
        </View>
      </TouchableOpacity>

      {/* Show route info when directions are active */}
      {showDirections && selectedVenue && (
        <View style={[styles.routeInfoContainer, 
          colorScheme === 'dark' ? styles.glassDark : styles.glassLight
        ]}>
          <View style={styles.routeInfoContent}>
            <Text style={[styles.routeVenueName, { color: themeColors.text }]}>
              {selectedVenue.name}
            </Text>
            <View style={styles.routeDetails}>
              {distance && (
                <View style={styles.routeDetailItem}>
                  <Ionicons name="navigate" size={18} color={themeColors.icon} />
                  <Text style={[styles.routeDetailText, { color: themeColors.textSecondary }]}>
                    {distance.toFixed(1)} km {isUsingFallback ? "(direct)" : ""}
                  </Text>
                </View>
              )}
              {duration && (
                <View style={styles.routeDetailItem}>
                  <Ionicons name="time" size={18} color={themeColors.icon} />
                  <Text style={[styles.routeDetailText, { color: themeColors.textSecondary }]}>
                    {Math.round(duration)} min {isUsingFallback ? "(est.)" : ""}
                  </Text>
                </View>
              )}
              {directionsError && DEBUG && (
                <View style={styles.routeDetailItem}>
                  <Ionicons name="alert-circle" size={18} color={"#f44336"} />
                  <Text style={[styles.routeDetailText, { color: "#f44336", fontSize: 10 }]} numberOfLines={1}>
                    API Error
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.closeRouteButton, { backgroundColor: themeColors.toggleButton }]}
            onPress={() => {
              setShowDirections(false);
              setSelectedVenue(null);
              setDistance(null);
              setDuration(null);
              setDirectionsError(null);
              setIsUsingFallback(false);
            }}
          >
            <Ionicons name="close" size={22} color={themeColors.icon} />
          </TouchableOpacity>
        </View>
      )}
      
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        index={0}
        style={[styles.bottomSheet, showDirections ? { marginTop: 80 } : {}]}
        handleIndicatorStyle={[styles.bottomSheetIndicator, { backgroundColor: themeColors.bottomSheetHandle }]}
        backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.bottomSheetHeader}>
          <View style={styles.headerRow}>
            <Text style={[styles.bottomSheetTitle, { color: themeColors.text }]}>Nearby Venues</Text>
            <TouchableOpacity 
              style={[styles.viewToggle, { backgroundColor: themeColors.toggleButton }]}
              onPress={toggleView}
            >
              <Ionicons 
                name={isDetailedView ? "list-outline" : "grid-outline"} 
                size={20} 
                color={themeColors.icon} 
              />
            </TouchableOpacity>
          </View>
          {isDetailedView ? (
            <Animated.View style={{ opacity: cardViewOpacity }}>
              <BottomSheetFlatList
                data={Venuedata.venues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <VenueCard
                    name={item.name}
                    type={item.type}
                    pricePerPerson={item.pricePerPerson}
                    rating={item.rating}
                    description={item.description}
                    openHours={item.openHours}
                    amenities={item.amenities}
                    coordinates={item.coordinates}
                    onPress={() => selectVenueForDirections(item)}
                    isDetailedView={true}
                    themeColors={themeColors}
                  />
                )}
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
              />
            </Animated.View>
          ) : (
            <Animated.View style={{ opacity: listViewOpacity }}>
              <BottomSheetFlatList
                data={Venuedata.venues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <VenueCard
                    name={item.name}
                    type={item.type}
                    pricePerPerson={item.pricePerPerson}
                    rating={item.rating}
                    description={item.description}
                    openHours={item.openHours}
                    amenities={item.amenities}
                    coordinates={item.coordinates}
                    onPress={() => selectVenueForDirections(item)}
                    isDetailedView={false}
                    themeColors={themeColors}
                  />
                )}
                contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
              />
            </Animated.View>
          )}
        </View>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  routeInfoContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    left: 10,
    right: 10,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: 'blur(10px)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  locateMeButton: {
    position: 'absolute',
    bottom: 130,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 999,
  },
  locateMeButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    // Dynamic colors applied in component
  },
  routeInfoContent: {
    flex: 1,
  },
  routeVenueName: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    // color handled dynamically
    marginBottom: 4,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeDetailText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
  },
  closeRouteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  glassDark: {
    backgroundColor: 'rgba(18, 18, 18, 0.75)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    elevation: 4,
  },
  glassLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    elevation: 4,
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
  bottomSheet: {
    zIndex: 1000,
  },
  bottomSheetBackground: {
    // backgroundColor handled dynamically
  },
  bottomSheetIndicator: {
    width: 40,
    // backgroundColor handled dynamically
  },
  bottomSheetHeader: {
    padding: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: 'Outfitsemibold',
    // color handled dynamically
    marginBottom: 16,
  },
  venueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    // backgroundColor handled dynamically
  },
  // Loading and permission styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    padding: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    textAlign: 'center',
  },
  permissionCard: {
    padding: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionTitle: {
    marginTop: 16,
    fontSize: 20,
    fontFamily: 'Outfitsemibold',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Outfitregular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfitmedium',
  },
})
