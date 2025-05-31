import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { BlurView } from "expo-blur"

type RootStackParamList = {
  "VenueDetail": { id: string };
};

type VenueCardProps = {
  id: string
  name: string
  description: string
  image: string
  rating: number
  location: string
  distance?: string
  openingHours?: string
  variant?: "default" | "horizontal"
  children?: React.ReactNode
}

export default function VenueCard({
  id,
  name,
  description,
  image,
  rating,
  location,
  distance,
  openingHours,
  variant = "default",
  children,
}: VenueCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const colorScheme = useColorScheme()
  
  // Theme colors
  const themeColors = {
    cardBackground: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF',
    textPrimary: colorScheme === 'dark' ? '#ffffff' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#aaaaaa' : '#636366',
    textTertiary: colorScheme === 'dark' ? '#888888' : '#8E8E93',
    shadow: colorScheme === 'dark' ? '#000000' : '#000000',
    shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.12
  }

  // Vertical card (default) - Apple-inspired design
  if (variant === "default") {
    return (
      <TouchableOpacity
        style={[styles.verticalCard, {
          backgroundColor: themeColors.cardBackground,
          shadowColor: themeColors.shadow,
          shadowOpacity: themeColors.shadowOpacity
        }]}
        onPress={() => navigation.navigate("VenueDetail", { id })}
        activeOpacity={0.9}
      >
        <View style={styles.verticalImageContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.verticalImage} 
            resizeMode="cover"
          />
          
          {/* SF Symbol-inspired Rating Badge with blur effect */}
          {Platform.OS === 'ios' ? (
            <BlurView intensity={70} style={styles.ratingContainerBlur} tint="dark">
              <Ionicons name="star" size={12} color="#FFCC00" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </BlurView>
          ) : (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFCC00" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
          
          {/* Opening hours badge */}
          {openingHours && (
            Platform.OS === 'ios' ? (
              <BlurView intensity={70} style={styles.hoursContainerBlur} tint="dark">
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>{openingHours}</Text>
              </BlurView>
            ) : (
              <View style={styles.hoursContainer}>
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>{openingHours}</Text>
              </View>
            )
          )}
          
          {children}
        </View>

        <View style={styles.verticalContent}>
          <View style={styles.verticalHeader}>
            <Text style={[styles.name, { color: themeColors.textPrimary }]} numberOfLines={1}>{name}</Text>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={12} color={themeColors.textTertiary} />
              <Text style={[styles.locationText, { color: themeColors.textTertiary }]} numberOfLines={1}>
                {location}
                {distance && ` · ${distance}`}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.description, { color: themeColors.textSecondary }]} numberOfLines={2}>{description}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  
  // Horizontal card (list view) - Apple-inspired design
  return (
    <TouchableOpacity
      style={[styles.horizontalCard, {
        backgroundColor: themeColors.cardBackground,
        shadowColor: themeColors.shadow,
        shadowOpacity: themeColors.shadowOpacity
      }]}
      onPress={() => navigation.navigate("VenueDetail", { id })}
      activeOpacity={0.9}
    >
      <View style={styles.horizontalImageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.horizontalImage} 
          resizeMode="cover"
        />
        
        {/* SF Symbol-inspired Rating Badge with blur effect */}
        {Platform.OS === 'ios' ? (
          <BlurView intensity={70} style={styles.ratingContainerBlur} tint="dark">
            <Ionicons name="star" size={12} color="#FFCC00" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </BlurView>
        ) : (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFCC00" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
        
        {/* Opening hours badge */}
        {openingHours && (
          Platform.OS === 'ios' ? (
            <BlurView intensity={70} style={styles.hoursContainerBlur} tint="dark">
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.badgeText}>{openingHours}</Text>
            </BlurView>
          ) : (
            <View style={styles.hoursContainer}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.badgeText}>{openingHours}</Text>
            </View>
          )
        )}
        
        {children}
      </View>

      <View style={styles.horizontalContent}>
        <View>
          <Text style={[styles.name, { color: themeColors.textPrimary }]} numberOfLines={1}>{name}</Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]} numberOfLines={2}>{description}</Text>
          
          {openingHours && (
            <View style={styles.openingHoursContainer}>
              <Ionicons name="time-outline" size={12} color={themeColors.textTertiary} />
              <Text style={[styles.openingHoursText, { color: themeColors.textTertiary }]}>{openingHours}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.horizontalFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={themeColors.textTertiary} />
            <Text style={[styles.locationText, { color: themeColors.textTertiary }]} numberOfLines={1}>
              {location}
              {distance && ` · ${distance}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  // Vertical Card Styles (Default)
  verticalCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    // iOS-style shadow
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    // Android elevation
    elevation: 4,
    // backgroundColor, shadowColor and shadowOpacity handled dynamically
  },
  verticalImageContainer: {
    position: "relative",
    width: "100%",
  },
  verticalImage: {
    width: "100%",
    aspectRatio: 5/3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  verticalContent: {
    padding: 16,
  },
  verticalHeader: {
    marginBottom: 8,
  },
  
  // Horizontal Card Styles
  horizontalCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    height: 120,
    // iOS-style shadow
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    // Android elevation
    elevation: 4,
    // backgroundColor, shadowColor and shadowOpacity handled dynamically
  },
  horizontalImageContainer: {
    position: "relative",
    width: 120,
    height: "100%",
  },
  horizontalImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  horizontalContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  horizontalFooter: {
    marginTop: 'auto',
  },
  
  // Common Styles
  name: {
    fontSize: 17,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitsemibold',
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.25,
    // color handled dynamically
  },
  description: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitregular',
    fontWeight: "400",
    marginBottom: 6,
    lineHeight: 20,
    // color handled dynamically
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitmedium',
    marginLeft: 4,
    letterSpacing: 0.15,
    // color handled dynamically
  },
  
  // Badge Styles - For both rating and hours badges
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitsemibold',
    fontWeight: "600",
    marginLeft: 4,
    letterSpacing: 0.25,
  },
  
  // Hours badge styles
  hoursContainerBlur: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  hoursContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  
  // Rating badge styles
  ratingContainerBlur: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  ratingContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitsemibold',
    fontWeight: "600",
    marginLeft: 4,
    letterSpacing: 0.25,
  },
  // Opening hours container & text styles
  openingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  openingHoursText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Outfitmedium',
    marginLeft: 4,
    letterSpacing: 0.15,
  },
});

