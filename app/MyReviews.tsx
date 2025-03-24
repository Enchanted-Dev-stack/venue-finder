import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  FlatList,
  ListRenderItem
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Define the review type
type Review = {
  id: string;
  venueName: string;
  venueImage: string;
  rating: number;
  date: string;
  text: string;
};

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: '1',
    venueName: 'Café Coffee Day',
    venueImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop',
    rating: 4.5,
    date: '2 weeks ago',
    text: 'Great ambiance and the coffee was excellent! The staff was friendly and the place was very clean. Would definitely visit again.'
  },
  {
    id: '2',
    venueName: 'Gaming Warriors',
    venueImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&h=500&fit=crop',
    rating: 3.5,
    date: '1 month ago',
    text: 'Nice selection of games, but it was a bit too crowded on the weekend. The staff was helpful though.'
  },
  {
    id: '3',
    venueName: 'Telibandha Lake Garden',
    venueImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=500&h=500&fit=crop',
    rating: 5.0,
    date: '3 months ago',
    text: 'Beautiful place for a peaceful evening walk. The garden is well-maintained and the lake view is stunning especially at sunset.'
  },
  {
    id: '4',
    venueName: 'The Book Café',
    venueImage: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=500&h=500&fit=crop',
    rating: 4.0,
    date: '2 months ago',
    text: 'Quiet place with a good collection of books. The coffee could be better, but overall it\'s a nice place to spend a few hours reading.'
  }
];

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.floor(rating) ? "star" : star <= rating ? "star-half" : "star-outline"}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
};

export default function MyReviewsScreen() {
  const router = useRouter();

  const renderReviewItem: ListRenderItem<Review> = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.venueInfo}>
          <Image 
            source={{ uri: item.venueImage }} 
            style={styles.venueImage} 
          />
          <View>
            <Text style={styles.venueName}>{item.venueName}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        <StarRating rating={item.rating} />
      </View>
      
      <Text style={styles.reviewText}>{item.text}</Text>
      
      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={18} color="#3b82f6" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockReviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.3</Text>
            <Text style={styles.statLabel}>Avg. Rating</Text>
          </View>
        </View>
        
        <FlatList
          data={mockReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  venueName: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#3b82f6',
    marginLeft: 4,
  },
}); 