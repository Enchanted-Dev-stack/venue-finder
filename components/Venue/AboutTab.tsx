import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import SectionDivider from '../ui/SectionDivider';

interface Venue {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  averageRating: number;
  reviewCount: number;
  location: {
    coordinates: number[];  // [longitude, latitude]
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
  pricing: string;    // e.g. 'Affordable', 'Premium'
  pricingMenu: any[];
  phone: string;
  website: string;
  email: string;
  operatingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
  isVerified: boolean;
  acceptingBookings: boolean;
}

interface AboutTabProps {
  venue: Venue;
  expanded: boolean;
}

const AboutTab = ({ venue, expanded }: AboutTabProps) => {

  return (
    <View style={[styles.tabContent, expanded && styles.expandedContent]}>
      <SectionDivider title="About" />
      <Text style={styles.description}>{venue.description || 'No description available'}</Text>
      
      {/* Category and Pricing - In a more compact panel */}
      <View style={styles.infoRow}>
        {venue.category && (
          <View style={styles.infoChip}>
            <Ionicons name="pricetag" size={14} color="#fff" />
            <Text style={styles.infoChipText}>{venue.category}</Text>
          </View>
        )}
        
        {venue.pricing && (
          <View style={styles.infoChip}>
            <Ionicons name="cash" size={14} color="#fff" />
            <Text style={styles.infoChipText}>{venue.pricing}</Text>
          </View>
        )}
        
        {venue.isVerified && (
          <View style={styles.infoChip}>
            <Ionicons name="checkmark-circle" size={14} color="#fff" />
            <Text style={styles.infoChipText}>Verified</Text>
          </View>
        )}
      </View>



      {/* Contact Information */}
      <SectionDivider title="Contact" />
      <View style={styles.detailsContainer}>
        {venue.phone && (
          <View style={styles.detailItem}>
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.detailText}>{venue.phone}</Text>
          </View>
        )}
        
        {venue.email && (
          <View style={styles.detailItem}>
            <Ionicons name="mail" size={16} color="#fff" />
            <Text style={styles.detailText}>{venue.email}</Text>
          </View>
        )}
        
        {venue.website && (
          <View style={styles.detailItem}>
            <Ionicons name="globe" size={16} color="#fff" />
            <Text style={styles.detailText}>{venue.website}</Text>
          </View>
        )}
      </View>

      {/* Amenities as badges */}
      {venue.amenities && venue.amenities.length > 0 && (
        <>
          <SectionDivider title="Amenities" />
          <View style={styles.amenitiesContainer}>
            {venue.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityBadge}>
                <Text style={styles.amenityBadgeText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <SectionDivider title="Location" />
      <View style={{ overflow: "hidden", marginTop: 4 }}>
        <MapView
          style={[styles.map, expanded && styles.expandedMap]}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: venue.location?.coordinates?.[1] || 37.7749,
            longitude: venue.location?.coordinates?.[0] || -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          customMapStyle={[
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2c2c2c"
                }
              ]
            }
          ]}
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
      <Text style={styles.addressText}>{venue.address}</Text>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabContent: {
    // padding: 16,
    backgroundColor: "#121212",  // Dark background to match venue details
  },
  expandedContent: {
    minHeight: height - 50,
  },
  section: {
    marginBottom: 20,  // Less margin for compactness
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",  // White text for dark theme
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#e0e0e0",  // Light gray for readability on dark background
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // Section header with icon
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 8,
  },
  // Info row for category, pricing, etc.
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',  // Dark blue for chips
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  infoChipText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },

  // Container styles
  detailsContainer: {
    backgroundColor: "#1e293b",  // Dark blue background
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",  // Darker divider
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#e0e0e0",  // Light gray text
    flex: 1,
  },
  detailLabel: {
    fontWeight: "500",
    color: "#fff",  // White text for labels
  },

  // Amenities as badges
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  amenityBadge: {
    backgroundColor: '#2563eb',  // Blue badge
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  amenityBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  // Map styles
  map: {
    height: 160,  // Smaller height for compactness
    width: '100%',
    borderRadius: 12,
    marginTop: 8,
  },
  expandedMap: {
    height: 240,
  },
  addressText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AboutTab;
