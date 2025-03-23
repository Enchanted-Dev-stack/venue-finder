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

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
          'https://images.unsplash.com/photo-1559305616-3f99cd43e353',
          'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
          'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
        ][Math.floor(Math.random() * 6)] + '?w=400&h=300&fit=crop'}}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.distance}>0.8 mi</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 80,
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
  },
  detailedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#6b7280',
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