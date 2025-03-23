import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

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

  return (
    <TouchableOpacity
      style={[styles.card, variant === "horizontal" ? styles.horizontalCard : styles.verticalCard]}
      onPress={() => navigation.navigate("VenueDetail", { id })}
    >
      <View style={[styles.imageContainer, variant === "horizontal" ? styles.horizontalImage : styles.verticalImage]}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFCA28" />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
        {children}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={12} color="#6b7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
              {distance && ` · ${distance}`}
            </Text>
          </View>

          {openingHours && (
            <View style={styles.hoursContainer}>
              <Ionicons name="time" size={12} color="#6b7280" />
              <Text style={styles.hoursText}>{openingHours}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verticalCard: {
    flexDirection: "column",
  },
  horizontalCard: {
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative",
  },
  verticalImage: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  horizontalImage: {
    width: 96,
    height: 96,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  footer: {
    marginTop: "auto",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
})

