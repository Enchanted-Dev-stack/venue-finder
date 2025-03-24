import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  FlatList,
  ListRenderItem,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Define the saved venue type
type SavedVenue = {
  id: string;
  name: string;
  image: string;
  type: string;
  location: string;
  priceRange: string;
  rating: number;
  date: string; // when it was saved
};

// Mock data for saved venues
const mockSavedVenues: SavedVenue[] = [
  {
    id: '1',
    name: 'Café Coffee Day',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop',
    type: 'cafe',
    location: 'Telibandha, 0.8 mi',
    priceRange: '₹300 per person',
    rating: 4.2,
    date: 'Saved 3 days ago'
  },
  {
    id: '2',
    name: 'Pixel Paradise',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=500&fit=crop',
    type: 'gaming_zone',
    location: 'Civil Lines, 2.1 mi',
    priceRange: '₹250 per person',
    rating: 4.3,
    date: 'Saved last week'
  },
  {
    id: '3',
    name: 'Board Game Adda',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500&h=500&fit=crop',
    type: 'chillzone',
    location: 'Shankar Nagar, 1.5 mi',
    priceRange: '₹200 per person',
    rating: 4.4,
    date: 'Saved 2 weeks ago'
  },
  {
    id: '4',
    name: 'Telibandha Lake Garden',
    image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=500&h=500&fit=crop',
    type: 'openspace',
    location: 'Telibandha, 1.2 mi',
    priceRange: 'Free',
    rating: 4.3,
    date: 'Saved 3 weeks ago'
  },
  {
    id: '5',
    name: 'The Book Café',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=500&h=500&fit=crop',
    type: 'cafe',
    location: 'Samta Colony, 3.4 mi',
    priceRange: '₹400 per person',
    rating: 4.6,
    date: 'Saved last month'
  },
  {
    id: '6',
    name: 'Marine Drive',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=500&fit=crop',
    type: 'openspace',
    location: 'Telibandha, 0.9 mi',
    priceRange: 'Free',
    rating: 4.5,
    date: 'Saved last month'
  }
];

// Venue type icons mapping
const venueTypeIcons: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  cafe: { name: "cafe-outline", color: '#FF8C00' },
  gaming_zone: { name: "game-controller-outline", color: '#FF0000' },
  openspace: { name: "leaf-outline", color: '#228B22' },
  chillzone: { name: "home-outline", color: '#9932CC' }
};

export default function SavedVenuesScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filteredVenues = filterType 
    ? mockSavedVenues.filter(venue => venue.type === filterType)
    : mockSavedVenues;

  // Calculate counts by venue type
  const venueCounts = mockSavedVenues.reduce((acc, venue) => {
    acc[venue.type] = (acc[venue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderVenueItem: ListRenderItem<SavedVenue> = ({ item }) => (
    <TouchableOpacity 
      style={styles.venueCard}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to venue details (you would implement this)
        // router.push(`/VenueDetail?id=${item.id}`);
      }}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.venueImage} 
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={[
          styles.typeIconBadge,
          { backgroundColor: `${venueTypeIcons[item.type].color}15` }
        ]}>
          <Ionicons 
            name={venueTypeIcons[item.type].name} 
            size={14} 
            color={venueTypeIcons[item.type].color} 
          />
        </View>
      </View>
      
      <View style={styles.venueDetails}>
        <Text style={styles.venueName} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.venueInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={14} color="#6b7280" />
            <Text style={styles.infoText}>{item.priceRange}</Text>
          </View>
        </View>
        
        <View style={styles.savedInfo}>
          <Text style={styles.savedDate}>{item.date}</Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => {
              // Logic to remove venue from saved list
            }}
          >
            <Ionicons name="bookmark" size={16} color="#3b82f6" />
            <Text style={styles.removeText}>Unsave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Venues</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockSavedVenues.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{venueCounts['cafe'] || 0}</Text>
            <Text style={styles.statLabel}>Cafés</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{venueCounts['gaming_zone'] || 0}</Text>
            <Text style={styles.statLabel}>Gaming</Text>
          </View>
        </View>
        
        {/* Filter indicator - only show if a filter is active */}
        {filterType && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Filtered by: {filterType === 'cafe' ? 'Café' : 
                          filterType === 'gaming_zone' ? 'Gaming' : 
                          filterType === 'openspace' ? 'Outdoors' : 'Hangout'}
            </Text>
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setFilterType(null)}
            >
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Venues List */}
        <FlatList
          data={filteredVenues}
          renderItem={renderVenueItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No saved venues found</Text>
              <Text style={styles.emptySubtext}>
                {filterType ? 'Try another filter or save some venues!' : 'Bookmark venues to see them here!'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Venues</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.filterOption, filterType === null && styles.filterOptionSelected]}
              onPress={() => {
                setFilterType(null);
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>All Venues</Text>
              {filterType === null && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'cafe' && styles.filterOptionSelected]}
              onPress={() => {
                setFilterType('cafe');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Cafés</Text>
              {filterType === 'cafe' && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'gaming_zone' && styles.filterOptionSelected]}
              onPress={() => {
                setFilterType('gaming_zone');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Gaming</Text>
              {filterType === 'gaming_zone' && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'openspace' && styles.filterOptionSelected]}
              onPress={() => {
                setFilterType('openspace');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Outdoors</Text>
              {filterType === 'openspace' && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, filterType === 'chillzone' && styles.filterOptionSelected]}
              onPress={() => {
                setFilterType('chillzone');
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.filterOptionText}>Hangout</Text>
              {filterType === 'chillzone' && <Ionicons name="checkmark" size={20} color="#3b82f6" />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  venueImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Outfitsemibold',
    color: 'white',
    marginLeft: 2,
  },
  typeIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  venueName: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 8,
  },
  venueInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
    marginLeft: 4,
  },
  savedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  savedDate: {
    fontSize: 11,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#3b82f6',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#4b5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ebf5ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  activeFilterText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#3b82f6',
  },
  clearFilterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  filterOptionSelected: {
    backgroundColor: '#f0f9ff',
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    color: '#4b5563',
  },
}); 