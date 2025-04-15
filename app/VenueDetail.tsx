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

// Define the venue interface based on the API response
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

// Define route param type
type VenueDetailRouteParams = {
  id: string;
};

const Tab = createMaterialTopTabNavigator()

function AboutTab({ venue }: { venue: Venue }) {
  // Format operating hours for display
  const formattedHours = [
    { 
      day: "Monday", 
      hours: venue.operatingHours?.monday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.monday?.open || 'N/A'} - ${venue.operatingHours?.monday?.close || 'N/A'}`
    },
    { 
      day: "Tuesday", 
      hours: venue.operatingHours?.tuesday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.tuesday?.open || 'N/A'} - ${venue.operatingHours?.tuesday?.close || 'N/A'}`
    },
    { 
      day: "Wednesday", 
      hours: venue.operatingHours?.wednesday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.wednesday?.open || 'N/A'} - ${venue.operatingHours?.wednesday?.close || 'N/A'}`
    },
    { 
      day: "Thursday", 
      hours: venue.operatingHours?.thursday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.thursday?.open || 'N/A'} - ${venue.operatingHours?.thursday?.close || 'N/A'}`
    },
    { 
      day: "Friday", 
      hours: venue.operatingHours?.friday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.friday?.open || 'N/A'} - ${venue.operatingHours?.friday?.close || 'N/A'}`
    },
    { 
      day: "Saturday", 
      hours: venue.operatingHours?.saturday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.saturday?.open || 'N/A'} - ${venue.operatingHours?.saturday?.close || 'N/A'}`
    },
    { 
      day: "Sunday", 
      hours: venue.operatingHours?.sunday?.isClosed 
        ? "Closed" 
        : `${venue.operatingHours?.sunday?.open || 'N/A'} - ${venue.operatingHours?.sunday?.close || 'N/A'}`
    },
  ];

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{venue.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operating Hours</Text>
        <View style={styles.hoursContainer}>
          {formattedHours.map((item, index) => (
            <View key={index} style={styles.hoursItem}>
              <Text style={styles.hoursDay}>{item.day}</Text>
              <Text style={styles.hoursTime}>{item.hours}</Text>
            </View>
          ))}
        </View>
      </View>

      {venue.amenities && venue.amenities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {venue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark" size={16} color="#3b82f6" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <MapView
          style={styles.map}
          provider="google"
          initialRegion={{
            latitude: venue.location?.coordinates?.[1] || 37.7749,
            longitude: venue.location?.coordinates?.[0] || -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: venue.location?.coordinates?.[1] || 37.7749,
              longitude: venue.location?.coordinates?.[0] || -122.4194,
            }}
            title={venue.name}
          />
        </MapView>
        </View>
      </View>
    </ScrollView>
  )
}

function MenuTab({ venue }: { venue: Venue }) {
  // Group menu items by category
  const menuCategories = venue.pricingMenu ? Object.values(venue.pricingMenu.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = { category, items: [] };
    }
    acc[category].items.push(item);
    return acc;
  }, {})) : [];

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {menuCategories.length > 0 ? (
        menuCategories.map((category: any, index) => (
          <View key={index} style={styles.menuCategory}>
            <Text style={styles.menuCategoryTitle}>{category.category}</Text>
            {category.items.map((item: any, itemIndex: number) => (
              <View key={itemIndex} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No menu items available</Text>
        </View>
      )}
    </ScrollView>
  )
}

function ReviewsTab({ venue }: { venue: Venue }) {
  // In production, you would fetch reviews from an API
  // For now, we'll create a placeholder if there are no reviews
  const mockReviews = [
    {
      id: "r1",
      user: "Alex Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this place! The atmosphere is amazing and the staff is super friendly.",
    },
    {
      id: "r2",
      user: "Sam Smith",
      rating: 4,
      date: "1 month ago",
      comment: "Great for events. The venue was perfect for our company gathering.",
    },
  ];

  const reviews = mockReviews; // Replace with actual reviews when available
  const rating = venue.averageRating || 4.5;
  const reviewCount = venue.reviewCount || reviews.length;

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.reviewSummary}>
        <View style={styles.reviewRating}>
          <Text style={styles.reviewRatingNumber}>{rating.toFixed(1)}</Text>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={16}
                color={star <= Math.floor(rating) ? "#FFCA28" : "#e5e7eb"}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
        </View>
        <TouchableOpacity style={styles.writeReviewButton}>
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No reviews yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

function PhotosTab({ venue }: { venue: Venue }) {
  const images = venue.media?.images || [];
  
  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {images.length > 0 ? (
        <View style={styles.photosGrid}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.photoItem} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No photos available</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default function VenueDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, VenueDetailRouteParams>, string>>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/venues/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        console.error("Error fetching venue details:", err);
        setError("Failed to load venue details. Please try again later.");
        Alert.alert("Error", "Failed to load venue details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenueDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
          Something went wrong
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          {error || "Venue not found"}
        </Text>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Image 
            source={{ 
              uri: venue.media.images?.[activeImageIndex] || 
                  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" 
            }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.venueInfo}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFCA28" />
                <Text style={styles.ratingText}>{venue.averageRating || 4.5}</Text>
                <Text style={styles.reviewCountText}>({venue.reviewCount || 0} reviews)</Text>
              </View>
              <Text style={styles.locationDot}>•</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#fff" />
                <Text style={styles.locationText}>{venue.address}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {venue.phone && (
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          {venue.acceptingBookings && (
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Reserve</Text>
            </TouchableOpacity>
          )}
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
          <Tab.Screen name="About" children={() => <AboutTab venue={venue} />} />
          <Tab.Screen name="Menu" children={() => <MenuTab venue={venue} />} />
          <Tab.Screen name="Reviews" children={() => <ReviewsTab venue={venue} />} />
          <Tab.Screen name="Photos" children={() => <PhotosTab venue={venue} />} />
        </Tab.Navigator>
        </View>
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
    paddingVertical: 8,
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
    paddingVertical: 8,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
})

