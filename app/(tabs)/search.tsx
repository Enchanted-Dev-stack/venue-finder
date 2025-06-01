import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, useColorScheme, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryFilter from '@/components/CategoryFilter'
import Venuedata from "@/data/venues.json"
import MobileHeader from '@/components/MobileHeader'
import VenueCard from '@/components/map/VenueCard'

export default function SearchScreen() {
  const [isDetailedView, setIsDetailedView] = useState(false)
  const colorScheme = useColorScheme()
  const [isAnimating, setIsAnimating] = useState(false)
  
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
      // Switch the view type after fade out completes
      setIsDetailedView(!isDetailedView)
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
    icon: colorScheme === 'dark' ? '#dadada' : '#6b7280'
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <MobileHeader title="Find a Venue" />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Categories</Text>
          <CategoryFilter />
        </View>

        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Popular Venues</Text>
            <TouchableOpacity 
              style={[styles.viewToggle, { backgroundColor: themeColors.toggleButton }]}
              onPress={toggleView}
            >
              <Ionicons 
                name={isDetailedView ? "list-outline" : "grid-outline"} 
                size={22} 
                color={themeColors.icon} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Container for both views with fixed height to maintain layout stability */}
          <View style={styles.venueListContainer}>
            {/* Only render one view at a time, with animation */}
            {isDetailedView ? (
              <Animated.View style={{ opacity: cardViewOpacity, padding: 16 }}>
              {Venuedata.venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    name={venue.name}
                    type={venue.type}
                    description={venue.description}
                    pricePerPerson={venue.pricePerPerson}
                    rating={venue.rating}
                    coordinates={venue.coordinates}
                    openHours={venue.openHours}
                    amenities={venue.amenities}
                    onPress={() => console.log(venue.name)}
                    isDetailedView={true}
                    themeColors={themeColors}
                  />
                ))}
              </Animated.View>
            ) : (
              <Animated.View style={{ opacity: listViewOpacity, padding: 16 }}>
              {Venuedata.venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    name={venue.name}
                    type={venue.type}
                    description={venue.description}
                    pricePerPerson={venue.pricePerPerson}
                    rating={venue.rating}
                    coordinates={venue.coordinates}
                    openHours={venue.openHours}
                    amenities={venue.amenities}
                    onPress={() => console.log(venue.name)}
                    isDetailedView={false}
                    themeColors={themeColors}
                  />
                ))}
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor handled dynamically
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  popularSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 4,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  venueListContainer: {
    position: 'relative',
    minHeight: 500,  // Provide enough space for content
  },
  venueList: {
    gap: 16,
  },
  venueCard: {
    flexDirection: 'row',
    // backgroundColor handled via props
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    // borderColor handled via props
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: 'white',
    fontFamily: 'Outfitsemibold',
    fontSize: 12,
    marginLeft: 3,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  venueName: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    // color handled via props
    marginBottom: 4,
  },
  venueDescription: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    // color handled via props
    marginBottom: 8,
    lineHeight: 20,
  },
  venueDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Outfitmedium',
    // color handled via props
    marginLeft: 6,
  },
});
