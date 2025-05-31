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
  price?: {
    amount: number;
    currency: string;
    unit: 'fixed' | 'per_person' | 'hour';
  };
  duration?: {
    hours: number;
    days: number;
  };
  images?: string[];
  capacity?: {
    min: number;
    max: number;
  };
  includes?: string[];
  available: boolean;
  venue: {
    _id: string;
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  count: number;
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
    packagePriceType: 'fixed' | 'per_person' | 'hour';
  };
};

const VenuePackages = () => {
  // Direct hooks for navigation and route
  const navigation = useNavigation<NavigationProp<AppParamList>>();
  const route = useRoute<RouteProp<AppParamList, 'VenuePackages'>>();
  
  // State variables
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venueDetails, setVenueDetails] = useState<{venueId: string, venueName: string}>({
    venueId: '', 
    venueName: ''
  });

  // Safely extract params from route
  useEffect(() => {
    try {
      if (route && route.params) {
        setVenueDetails({
          venueId: route.params.venueId || '',
          venueName: route.params.venueName || ''
        });
      }
    } catch (err) {
      console.error("Error accessing route params:", err);
      setError("Navigation error. Please go back and try again.");
    }
  }, [route]);

  // Fetch packages when venue details are available
  useEffect(() => {
    const fetchVenuePackages = async () => {
      // Only fetch if we have a venueId
      if (!venueDetails.venueId) {
        setLoading(false);
        if (!error) setError("No venue ID provided. Please go back and select a venue.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/packages?venue=${venueDetails.venueId}`);
        const data = await response.json();

        if (data.success) {
          setPackages(data.data || []);
          setError(null);
        } else {
          setError(data.message || "Failed to load packages");
          setPackages([]);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Network error. Please check your connection and try again.");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenuePackages();
  }, [venueDetails.venueId]);

  const navigateToReservation = (packageItem: Package) => {
    // Navigate to reservation form with package details
    navigation.navigate('ReservationForm', {
      venueId: venueDetails.venueId,
      venueName: venueDetails.venueName,
      packageId: packageItem._id,
      packageName: packageItem.name,
      packagePrice: packageItem.price?.amount || 0,
      packagePriceType: packageItem.price?.unit || 'fixed' as 'fixed' | 'per_person' | 'hour'
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderPackage = ({ item }: { item: Package }) => {
    // Format price with currency
    const formatPrice = (price?: { amount: number; unit: string }) => {
      if (!price) return "Price unavailable";
      return `$${price.amount} ${price.unit === 'per_person' ? '/ person' : price.unit === 'hour' ? '/ hour' : ''}`;
    };

    // Calculate display for duration
    const formatDuration = (duration?: { hours: number; days: number }) => {
      if (!duration) return null;
      if (duration.days > 0) {
        return `${duration.days} day${duration.days > 1 ? 's' : ''}`;
      } else if (duration.hours > 0) {
        return `${duration.hours} hour${duration.hours > 1 ? 's' : ''}`;
      }
      return null;
    };

    // Limit the number of includes items to display
    const displayIncludes = item.includes ? item.includes.slice(0, 3) : [];
    const remainingIncludes = item.includes ? Math.max(0, item.includes.length - 3) : 0;

    return (
      <View style={styles.packageCard}>
        <View style={styles.packageBanner}>
          {item.images && item.images.length > 0 ? (
            <Image 
              source={{ uri: item.images[0] }}
              style={styles.packageImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              style={styles.packageImage}
            />
          )}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
          </View>
          {!item.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableBadgeText}>Currently Unavailable</Text>
            </View>
          )}
        </View>
        
        <View style={styles.packageContent}>
          <View style={styles.packageHeader}>
            <Text style={styles.packageName}>{item.name}</Text>
            {formatDuration(item.duration) && (
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={14} color="#4f46e5" />
                <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.packageDescription}>{item.description}</Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What's included:</Text>
            {displayIncludes.length > 0 ? (
              <View style={styles.includesList}>
                {displayIncludes.map((include, index) => (
                  <View key={index} style={styles.includeItem}>
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                    <Text style={styles.includeText}>{include}</Text>
                  </View>
                ))}
                {remainingIncludes > 0 && (
                  <Text style={styles.moreIncludes}>+{remainingIncludes} more items</Text>
                )}
              </View>
            ) : (
              <Text style={styles.noIncludeText}>No includes specified for this package</Text>
            )}
          </View>
          
          {item.capacity && (
            <View style={styles.capacityContainer}>
              <Ionicons name="people-outline" size={16} color="#64748b" />
              <Text style={styles.capacityText}>
                {item.capacity.min === item.capacity.max
                  ? `Capacity: ${item.capacity.max} people`
                  : `Capacity: ${item.capacity.min}-${item.capacity.max} people`}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.selectButton, !item.available && { opacity: 0.6 }]}
            onPress={() => item.available && navigateToReservation(item)}
            disabled={!item.available}
          >
            <Text style={styles.selectButtonText}>
              {item.available ? 'Select Package' : 'Not Available'}
            </Text>
            {item.available && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    );
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
          onPress={goBack}
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
          onPress={goBack}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={['#4f46e5', '#6366f1']}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={goBack}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>Venue Packages</Text>
          <Text style={styles.heroTitle}>{venueDetails.venueName}</Text>
        </View>
      </View>
      
      <FlatList
        data={packages}
        renderItem={renderPackage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.packagesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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

export default VenuePackages;
