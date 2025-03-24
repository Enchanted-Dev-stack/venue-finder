"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import MapView from 'react-native-maps';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { StatusBar } from 'expo-status-bar'

import VenueCard from "@/components/VenueCard"

// type VenueDetailScreenRouteProp = RouteProp<RootStackParamList, "VenueDetail">

// Mock data for venue details with realistic images
const venueDetails = {
  id: "1",
  name: "The Cozy Corner",
  description:
    "A relaxing cafe with artisanal coffee and homemade pastries. Our mission is to provide a comfortable space for people to work, socialize, or simply enjoy a great cup of coffee. We source our beans from local roasters and our pastries are made fresh daily.",
  images: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2070&auto=format&fit=crop",
  ],
  rating: 4.7,
  reviewCount: 128,
  location: "123 Main St, Downtown",
  phone: "(555) 123-4567",
  website: "www.cozycorner.com",
  hours: [
    { day: "Monday - Friday", hours: "7:00 AM - 10:00 PM" },
    { day: "Saturday - Sunday", hours: "8:00 AM - 11:00 PM" },
  ],
  amenities: ["Free WiFi", "Outdoor Seating", "Pet Friendly", "Wheelchair Accessible"],
  menu: [
    {
      category: "Coffee",
      items: [
        { name: "Espresso", price: "$3.50", description: "Double shot of our signature espresso blend" },
        { name: "Cappuccino", price: "$4.50", description: "Espresso with steamed milk and foam" },
        { name: "Cold Brew", price: "$4.75", description: "Slow-steeped for 24 hours" },
      ],
    },
    {
      category: "Pastries",
      items: [
        { name: "Croissant", price: "$3.75", description: "Buttery, flaky pastry" },
        { name: "Blueberry Muffin", price: "$3.50", description: "Made with fresh blueberries" },
        { name: "Cinnamon Roll", price: "$4.25", description: "Freshly baked with cream cheese frosting" },
      ],
    },
  ],
  reviews: [
    {
      id: "r1",
      user: "Alex Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this place! The coffee is amazing and the staff is super friendly.",
    },
    {
      id: "r2",
      user: "Sam Smith",
      rating: 4,
      date: "1 month ago",
      comment: "Great atmosphere for working. The WiFi is reliable and the pastries are delicious.",
    },
    {
      id: "r3",
      user: "Jamie Lee",
      rating: 5,
      date: "2 months ago",
      comment: "My favorite cafe in town. I come here at least twice a week.",
    },
  ],
}

// Mock data for similar venues
const similarVenues = [
  {
    id: "2",
    name: "Brew & Bake",
    description: "Artisan bakery and coffee shop with a cozy atmosphere",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    location: "456 Baker St, Downtown",
    openingHours: "Open until 9PM",
  },
  {
    id: "3",
    name: "Morning Bliss",
    description: "Specialty coffee and breakfast items in a bright, airy space",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    location: "789 Sunrise Ave, Eastside",
    openingHours: "Open until 3PM",
  },
]

const Tab = createMaterialTopTabNavigator()

function AboutTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{venueDetails.description}</Text>
      </View>

{/* #Contact Information */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="location" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.contactText}>{venueDetails.location}</Text>
        </View>
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="call" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.contactText}>{venueDetails.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Ionicons name="globe" size={20} color="#3b82f6" />
          </View>
          <Text style={styles.contactText}>{venueDetails.website}</Text>
        </View>
      </View> */}

      <View style={styles.section}>
        {/* <Text style={styles.sectionTitle}>Hours</Text> */}
        <View style={styles.hoursContainer}>
          {venueDetails.hours.map((item, index) => (
            <View key={index} style={styles.hoursItem}>
              <Text style={styles.hoursDay}>{item.day}</Text>
              <Text style={styles.hoursTime}>{item.hours}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {venueDetails.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons name="checkmark" size={16} color="#3b82f6" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <MapView
          style={styles.map}
          provider="google"
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
        </View>
      </View>
    </ScrollView>
  )
}

function MenuTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {venueDetails.menu.map((category, index) => (
        <View key={index} style={styles.menuCategory}>
          <Text style={styles.menuCategoryTitle}>{category.category}</Text>
          {category.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
              </View>
              <Text style={styles.menuItemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

function ReviewsTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.reviewSummary}>
        <View style={styles.reviewRating}>
          <Text style={styles.reviewRatingNumber}>{venueDetails.rating}</Text>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={16}
                color={star <= Math.floor(venueDetails.rating) ? "#FFCA28" : "#e5e7eb"}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>{venueDetails.reviewCount} reviews</Text>
        </View>
        <TouchableOpacity style={styles.writeReviewButton}>
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsList}>
        {venueDetails.reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewUser}>{review.user}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={14} color={star <= review.rating ? "#FFCA28" : "#e5e7eb"} />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

function PhotosTab() {
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.photosGrid}>
        {venueDetails.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.photoItem} />
        ))}
      </View>
    </ScrollView>
  )
}

export default function VenueDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#f43f5e" : "#fff"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scrollView}>
        <View style={styles.heroSection}>
          <Image source={{ uri: venueDetails.images[activeImageIndex] }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.venueName}>{venueDetails.name}</Text>
            <View style={styles.venueInfo}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFCA28" />
                <Text style={styles.ratingText}>{venueDetails.rating}</Text>
                <Text style={styles.reviewCountText}>({venueDetails.reviewCount} reviews)</Text>
              </View>
              <Text style={styles.locationDot}>•</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.locationText}>{venueDetails.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="navigate" size={20} color="#3b82f6" />
            <Text style={styles.secondaryButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#3b82f6",
            tabBarInactiveTintColor: "#6b7280",
            tabBarIndicatorStyle: { backgroundColor: "yellow", height: 4},
            tabBarStyle: { elevation: 0, shadowOpacity: 0, backgroundColor: "#1e2b3c" },
            tabBarLabelStyle: { fontSize: 14, fontWeight: "500", textTransform: "none", color: "#fff", fontFamily: "Handjet" },
          }}
        >
          <Tab.Screen name="About" component={AboutTab} />
          <Tab.Screen name="Menu" component={MenuTab} />
          <Tab.Screen name="Reviews" component={ReviewsTab} />
          <Tab.Screen name="Photos" component={PhotosTab} />
        </Tab.Navigator>
        </View>

        {/* <View style={styles.similarVenuesSection}>
          <Text style={styles.similarVenuesTitle}>Similar Venues</Text>
          <View style={styles.similarVenuesList}>
            {similarVenues.map((venue) => (
              <VenueCard key={venue.id} {...venue} />
            ))}
          </View>
        </View> */}
      </View>
    </View>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  venueName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  venueInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
  },
  reviewCountText: {
    color: "#e5e7eb",
    fontSize: 12,
    marginLeft: 4,
  },
  locationDot: {
    color: "#e5e7eb",
    marginHorizontal: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 8,
    paddingHorizontal: 4,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 1000,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "Handjet",
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 1000,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontWeight: "500",
    marginLeft: 8,
  },
  tabContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "Montserratmedium",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    fontFamily: "Outfitlight",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
  },
  hoursContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    //shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: .5,
  },
  hoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hoursDay: {
    fontFamily: "Outfitlight",
  },
  hoursTime: {
    color: "#6b7280",
    fontFamily: "Ralewayregular",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  map: {
    width: "100%",
    height: 200,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 5000,
    padding: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Outfitlight",
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  menuCategory: {
    marginBottom: 24,
  },
  menuCategoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  menuItemContent: {
    flex: 1,
    marginRight: 8,
  },
  menuItemName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  menuItemPrice: {
    fontWeight: "500",
  },
  reviewSummary: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewRating: {
    alignItems: "center",
    marginRight: 16,
  },
  reviewRatingNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  reviewStars: {
    flexDirection: "row",
    marginVertical: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  writeReviewButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  writeReviewButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  reviewsList: {
    marginTop: 16,
  },
  reviewItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: "500",
  },
  reviewDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  reviewComment: {
    marginTop: 8,
    color: "#6b7280",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoItem: {
    width: (width - 40) / 2,
    height: (width - 40) / 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  similarVenuesSection: {
    padding: 16,
  },
  similarVenuesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  similarVenuesList: {
    gap: 16,
  },
})

