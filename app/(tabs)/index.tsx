import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { NavigatorScreenParams } from '@react-navigation/native';
import MobileHeader from "@/components/MobileHeader"
import SearchBar from "@/components/SearchBar"
// import FeaturedCarousel from "../components/FeaturedCarousel"
import CategoryFilter from "@/components/CategoryFilter"
import VenueCard from "@/components/VenueCard"
// import VenueCard from "../components/VenueCard"
type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

type TabParamList = {
  Search: undefined;
};
// Mock data for venues with realistic images
const venues = [
  {
    id: "1",
    name: "The Cozy Corner",
    description: "A relaxing cafe with artisanal coffee and homemade pastries",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
    rating: 4.7,
    location: "123 Main St, Downtown",
    openingHours: "Open until 10PM",
  },
  {
    id: "2",
    name: "Pixel Playground",
    description: "Gaming station with the latest consoles and VR experiences",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2071&auto=format&fit=crop",
    rating: 4.9,
    location: "456 Tech Ave, Midtown",
    openingHours: "Open until 12AM",
  },
  {
    id: "3",
    name: "Flavor Fusion",
    description: "Modern restaurant with international cuisine and craft cocktails",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    location: "789 Culinary Blvd, Uptown",
    openingHours: "Open until 11PM",
  },
  {
    id: "4",
    name: "Melody Lounge",
    description: "Live music venue with local bands and specialty drinks",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    location: "321 Harmony Rd, Arts District",
    openingHours: "Open until 2AM",
  },
  {
    id: "5",
    name: "Serene Spa Retreat",
    description: "Luxury spa offering massages, facials, and wellness treatments",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    location: "555 Relaxation Way, Wellness Center",
    openingHours: "Open until 9PM",
  },
  {
    id: "6",
    name: "Urban Rooftop Bar",
    description: "Stylish rooftop bar with panoramic city views and signature cocktails",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=2029&auto=format&fit=crop",
    rating: 4.4,
    location: "888 Skyline Dr, Financial District",
    openingHours: "Open until 1AM",
  },
]

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MobileHeader showBack={false}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* <SearchBar style={styles.searchBar} /> */}
        {/* <FeaturedCarousel /> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryFilter />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Venues</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Search" })}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.venueList}>
            {venues.map((venue) => (
              <VenueCard key={venue.id} {...venue} />
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    marginVertical: 12,
  },
  section: {
    marginTop: 8,
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
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
  },
  venueList: {
    gap: 16,
  },
})

