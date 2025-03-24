import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type VenueCardProps = {
  name: string
  type: string
  pricePerPerson: number
  rating: number
  description: string
  openHours: string
  amenities: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  onPress: () => void
  isDetailedView: boolean
}

export default function VenueCard({
  name,
  type,
  pricePerPerson,
  rating,
  description,
  coordinates,
  onPress,
  isDetailedView,
  openHours,
  amenities,
}: VenueCardProps) {
  if (isDetailedView) {
    return (
      <TouchableOpacity 
        style={styles.detailedCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: [
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
              'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
              'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
              'https://images.unsplash.com/photo-1559305616-3f99cd43e353',
              'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
              'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
            ][Math.floor(Math.random() * 6)] + '?w=400&h=300&fit=crop'}}
            style={styles.detailedImage}
          />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating}</Text>
            <Ionicons name="star" size={12} color="#FFD700" />
          </View>
        </View>
        
        <View style={styles.detailedContent}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.type}>{type.replace('_', ' ')}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.detailText}>{openHours}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={14} color="#6b7280" />
              <Text style={styles.detailText}>
                {pricePerPerson === 0 ? 'Free' : `₹${pricePerPerson}/person`}
              </Text>
            </View>
          </View>

          <View style={styles.amenities}>
            {amenities?.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityBadge}>
                <Text style={styles.amenityText}>
                  {amenity.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Completely new compact list view
  return (
    <TouchableOpacity 
      style={styles.listCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left side - Image with rating */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
            'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
            'https://images.unsplash.com/photo-1559305616-3f99cd43e353'
          ][Math.floor(Math.random() * 4)] + '?w=500&h=500&fit=crop' }}
          style={styles.listImage}
        />
        <View style={styles.listRatingBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.listRatingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Right side - Content */}
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listName}>{name}</Text>
          <Text style={styles.listDescription} numberOfLines={2}>
            {description}
          </Text>
        </View>

        <View style={styles.listFooter}>
          <View style={styles.listDetailRow}>
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text style={styles.listDetailText}>
              {type.replace('_', ' ')} · 0.8 mi
            </Text>
          </View>
          
          <View style={styles.listDetailRow}>
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text style={styles.listDetailText}>{openHours}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  // Brand new list view styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listRatingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  listRatingText: {
    color: 'white',
    fontFamily: 'Outfitsemibold',
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listHeader: {
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 13,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
    display: 'none',
    lineHeight: 20,
  },
  listFooter: {
    marginTop: 'auto',
  },
  listDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  listDetailText: {
    fontSize: 11,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
    marginLeft: 6,
  },

  // Keep the existing detailed view styles
  detailedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  detailedImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Outfitsemibold',
    color: 'white',
  },
  detailedContent: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
    marginLeft: 6,
  },
  amenities: {
    flexDirection: 'row',
    marginTop: 8,
  },
  amenityBadge: {
    backgroundColor: '#f3f4f6',
    padding: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
  },
}) 