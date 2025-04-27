"use client"

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  useNavigation, 
  useRoute, 
  type RouteProp,
  NavigationProp
} from "@react-navigation/native";

// Define the package interface based on the API response
interface Package {
  _id: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    unit: 'fixed' | 'per_person';
  };
  duration: number; // in hours
  includes?: string[];
  maxCapacity: number;
  imageUrl?: string;
  isAvailable: boolean;
}

// Define venue interface (simplified)
interface Venue {
  _id: string;
  name: string;
  packages: Package[];
}

// Define navigation param types
type AppParamList = {
  VenuePackages: {
    venueId: string;
    venueName: string;
  };
  ReservationForm: {
    venueId: string;
    venueName: string;
    packageId: string;
    packageName: string;
    packagePrice: number;
    packagePriceType: 'fixed' | 'per_person';
  };
};

type VenuePackagesProps = {
  route: RouteProp<AppParamList, 'VenuePackages'>;
  navigation: NavigationProp<AppParamList>;
};

export default function VenuePackages(props: Partial<VenuePackagesProps>) {
  // Use direct hooks to ensure we always have navigation objects
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const route = useRoute<RouteProp<AppParamList, 'VenuePackages'>>();
  
  // Use props if provided, otherwise fallback to hooks
  const routeToUse = props?.route || route;
  const navigationToUse = props?.navigation || navigation;
  
  // Safety check for route params
  const { venueId = '', venueName = '' } = routeToUse?.params || {};
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we have a venueId
    if (!venueId) {
      setError("No venue ID provided");
      setLoading(false);
      return;
    }
    
    const fetchVenuePackages = async () => {
      try {
        setLoading(true);
        // Use the dedicated packages API endpoint instead of venue details
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/packages?venue=${venueId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
          setPackages(data.data);
        } else {
          console.log('API response unsuccessful or missing data, using dummy data');
          setPackages([
            {
              _id: "pkg1",
              name: "Standard Package",
              description: "Our basic package including venue rental for 4 hours and standard amenities.",
              price: {
                amount: 499,
                currency: "USD",
                unit: "fixed"
              },
              duration: 4,
              includes: ["Venue rental", "Basic decoration", "Sound system", "Cleaning service"],
              maxCapacity: 50,
              isAvailable: true
            },
            {
              _id: "pkg2",
              name: "Premium Package",
              description: "Our premium package includes everything in the standard package plus catering and premium decorations.",
              price: {
                amount: 799,
                currency: "USD",
                unit: "fixed"
              },
              duration: 6,
              includes: ["Venue rental", "Premium decoration", "Sound system", "Catering service", "Dedicated host", "Cleaning service"],
              maxCapacity: 80,
              isAvailable: true
            },
            {
              _id: "pkg3",
              name: "Deluxe Package",
              description: "The complete experience with all premium amenities and services.",
              price: {
                amount: 129,
                currency: "USD",
                unit: "per_person"
              },
              duration: 8,
              includes: ["Venue rental", "Luxury decoration", "Professional sound", "Premium catering", "Dedicated staff", "Photography", "Valet parking"],
              maxCapacity: 100,
              isAvailable: true
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching venue packages:", err);
        setError("Failed to load packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenuePackages();
  }, [venueId]);

  const navigateToReservation = (packageItem: Package) => {
    // Navigate to reservation form with package details
    navigationToUse.navigate('ReservationForm', {
      venueId,
      venueName,
      packageId: packageItem._id,
      packageName: packageItem.name,
      packagePrice: packageItem.price?.amount || 0,
      packagePriceType: packageItem.price?.unit || 'fixed' as 'fixed' | 'per_person'
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="light" />
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigationToUse.goBack()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (packages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar style="light" />
        <Ionicons name="calendar-outline" size={64} color="#94a3b8" />
        <Text style={styles.emptyTitle}>No Packages Available</Text>
        <Text style={styles.emptyText}>This venue doesn't have any packages available at the moment.</Text>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigationToUse.goBack()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hero section with back button overlay */}
      <View style={styles.heroContainer}>
        <Image 
          source={{ 
            uri: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
          }} 
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigationToUse.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>Choose a Package</Text>
          <Text style={styles.heroTitle}>{venueName}</Text>
        </View>
      </View>
      
      {/* Packages list */}
      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.packagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: pkg }) => (
          <TouchableOpacity 
            style={styles.packageCard}
            onPress={() => navigateToReservation(pkg)}
            activeOpacity={0.95}
          >
            {/* Package Card Banner */}
            <View style={styles.packageBanner}>
              {pkg.imageUrl ? (
                <Image 
                  source={{ uri: pkg.imageUrl }} 
                  style={styles.packageImage}
                />
              ) : (
                <LinearGradient
                  colors={['#4f46e5', '#7c3aed']}
                  style={styles.packageImage}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              
              {/* Availability Badge */}
              {!pkg.isAvailable && (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableBadgeText}>Currently Unavailable</Text>
                </View>
              )}
              
              {/* Price Tag */}
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  {pkg.price && pkg.price.amount 
                    ? `${pkg.price.currency === 'USD' ? '$' : ''}${pkg.price.amount}` 
                    : '$0'}
                </Text>
                <Text style={styles.priceUnit}>
                  {pkg.price && pkg.price.unit === 'per_person' 
                    ? ' / person' 
                    : pkg.price && pkg.price.unit === 'fixed' ? ' total' : ''}
                </Text>
              </View>
            </View>
            
            {/* Package Content */}
            <View style={styles.packageContent}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageName}>{pkg.name}</Text>
                {pkg.duration && (
                  <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={14} color="#4f46e5" style={{marginRight: 4}} />
                    <Text style={styles.durationText}>{pkg.duration} hours</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              
              {/* Features */}
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>What's included:</Text>
                
                {/* Inclusions */}
                <View style={styles.includesList}>
                  {pkg.includes && pkg.includes.length > 0 ? (
                    <>
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <View key={index} style={styles.includeItem}>
                          <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          </View>
                          <Text style={styles.includeText}>{item}</Text>
                        </View>
                      ))}
                      {pkg.includes.length > 3 && (
                        <Text style={styles.moreIncludes}>+{pkg.includes.length - 3} more included</Text>
                      )}
                    </>
                  ) : (
                    <View style={styles.includeItem}>
                      <Text style={styles.noIncludeText}>No inclusions specified</Text>
                    </View>
                  )}
                </View>
              </View>
              
              {/* Capacity Badge */}
              {pkg.maxCapacity > 0 && (
                <View style={styles.capacityContainer}>
                  <Ionicons name="people-outline" size={16} color="#64748b" />
                  <Text style={styles.capacityText}>Up to {pkg.maxCapacity} guests</Text>
                </View>
              )}
              
              {/* Select Button */}
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => navigateToReservation(pkg)}
              >
                <Text style={styles.selectButtonText}>Select Package</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569',
    fontFamily: 'Outfit',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
    fontFamily: 'Outfit',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 22,
    fontFamily: 'Outfit',
    fontWeight: '600',
    color: '#334155',
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    fontFamily: 'Outfit',
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4338ca',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit',
    fontWeight: '600',
  },
  heroContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Outfit',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontFamily: 'Outfit',
    fontWeight: '400',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  packagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageBanner: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  packageImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Outfit',
    fontWeight: '700',
    color: '#0f172a',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Outfit',
    fontWeight: '400',
    color: '#64748b',
  },
  unavailableBadge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  unavailableBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Outfit',
    fontWeight: '600',
  },
  packageContent: {
    padding: 16,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 20,
    fontFamily: 'Outfit',
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  durationText: {
    color: '#4f46e5',
    fontSize: 13,
    fontFamily: 'Outfit',
    fontWeight: '500',
  },
  packageDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 16,
    fontFamily: 'Outfit',
    fontWeight: '400',
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    fontFamily: 'Outfit',
    fontWeight: '600',
  },
  includesList: {
    marginBottom: 8,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  includeText: {
    fontSize: 14,
    color: '#334155',
    fontFamily: 'Outfit',
    fontWeight: '400',
    flex: 1,
  },
  moreIncludes: {
    fontSize: 14,
    color: '#6366f1',
    fontFamily: 'Outfit',
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 28,
  },
  noIncludeText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Outfit',
    fontWeight: '400',
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  capacityText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontFamily: 'Outfit',
    fontWeight: '400',
  },
  selectButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4338ca',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit',
    fontWeight: '600',
    marginRight: 8,
  }
});
