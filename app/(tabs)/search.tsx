import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryFilter from '@/components/CategoryFilter'
import Venuedata from "@/data/venues.json"
import MobileHeader from '@/components/MobileHeader'
import VenueCard from '@/components/map/VenueCard'

export default function SearchScreen() {
  const [isDetailedView, setIsDetailedView] = useState(false)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MobileHeader title="Find a Venue" />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryFilter />
        </View>

        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Venues</Text>
            <TouchableOpacity 
              style={styles.viewToggle}
              onPress={() => setIsDetailedView(!isDetailedView)}
            >
              <Ionicons 
                name={isDetailedView ? "list-outline" : "grid-outline"} 
                size={22} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.venueList}>
            {Venuedata.venues.map((venue) => (
              <VenueCard
                key={venue.id}
                name={venue.name}
                type={venue.type}
                pricePerPerson={venue.pricePerPerson}
                rating={venue.rating}
                description={venue.description}
                openHours={venue.openHours}
                amenities={venue.amenities}
                coordinates={venue.coordinates}
                onPress={() => {}}
                isDetailedView={isDetailedView}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  venueList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  venueDescription: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
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
    color: '#6b7280',
    marginLeft: 6,
  },
});
