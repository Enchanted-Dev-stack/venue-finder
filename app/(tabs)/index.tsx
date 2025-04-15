import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Button } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { NavigatorScreenParams } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import MobileHeader from "@/components/MobileHeader"
import { Feather } from "@expo/vector-icons"
import { FontAwesome6 } from "@expo/vector-icons"
import { SimpleLineIcons } from "@expo/vector-icons"
import VenueCard from "@/components/VenueCard"
// import VenueCard from "../components/VenueCard"
import { useState, useEffect } from "react";
import CategoryFilter from "@/components/CategoryFilterHome"

// Define TabParamList directly here instead of importing
type TabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Settings: undefined;
};

type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  Home: undefined;
  AllVenues: undefined;
  Venue: {
    venue: {
      id: string;
      name: string;
      description: string;
      image: string;
      rating: number;
      location: string;
      openingHours: string;
    }
  };
  Search: undefined;
};

// Define the Venue type to match the API response
interface Venue {
  _id: string;
  name: string;
  description: string;
  media: {
    images: string[];
  };
  rating: number;
  address: string;
  operatingHours: {
    monday: { open: string; close: string; isClosed: boolean };
    tuesday: { open: string; close: string; isClosed: boolean };
    wednesday: { open: string; close: string; isClosed: boolean };
    thursday: { open: string; close: string; isClosed: boolean };
    friday: { open: string; close: string; isClosed: boolean };
    saturday: { open: string; close: string; isClosed: boolean };
    sunday: { open: string; close: string; isClosed: boolean };
  };
}

// Helper function to format opening hours
const getFormattedOpeningHours = (hours: Venue['operatingHours']) => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMapping: Record<number, string> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  
  const day = dayMapping[today];
  // Use type assertion to access the property safely
  const todayHours = hours[day as keyof typeof hours];
  
  if (todayHours.isClosed) {
    return "Closed today";
  }
  
  return `Open until ${todayHours.close}`;
}

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  
  // State variables inside the component
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch venues from the API
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/venues`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setVenues(data.data || []);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
        Alert.alert("Error", "Failed to load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Show error message if fetching failed
  if (error) {
    const handleRetry = () => {
      setError(null);
      setLoading(true);
      
      const fetchVenues = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/venues`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          setVenues(data.data || []);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching venues:", err);
          setError("Failed to load venues. Please try again later.");
          Alert.alert("Error", "Failed to load venues. Please try again later.");
          setLoading(false);
        }
      };

      fetchVenues();
    };
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MobileHeader showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryFilter />
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Venues</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllVenues')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.venueList}>
            {venues.map((venue) => (
              <VenueCard
                key={venue._id}
                id={venue._id}
                name={venue.name}
                description={venue.description}
                image={venue.media.images[0] || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"}
                rating={venue.rating || 0}
                location={venue.address}
                openingHours={getFormattedOpeningHours(venue.operatingHours)}
                variant="default"
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
    backgroundColor: "#fff",
  },
  heroSection: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
  },
  categorySection: {
    marginTop: 16,
  },
  categoryItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
  },
  categoryIcon: {
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
  },
  venueList: {
    gap: 16,
  },
})

