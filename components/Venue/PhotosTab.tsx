import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Venue {
  _id: string;
  name: string;
  media: {
    images: string[];
    hasPromoVideo?: boolean;
    promoVideoUrl?: string;
    has360Tour?: boolean;
    tour360Url?: string;
  };
}

interface PhotosTabProps {
  venue: Venue;
  expanded: boolean;
}

const PhotosTab = ({ venue, expanded }: PhotosTabProps) => {
  const images = venue.media?.images || [];
  
  return (
    <ScrollView 
      style={[styles.tabContent, expanded && styles.expandedContent]} 
      showsVerticalScrollIndicator={false}
    >
      {images.length > 0 ? (
        <View style={[styles.photosGrid, expanded && styles.expandedGrid]}>
          {images.map((image, index) => (
            <Image 
              key={index} 
              source={{ uri: image }} 
              style={[styles.photoItem, expanded && styles.expandedPhotoItem]} 
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No photos available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
    backgroundColor: "#fff",
  },
  expandedContent: {
    minHeight: height - 50, // Adjusted for tab bar height
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  expandedGrid: {
    justifyContent: "space-evenly",
  },
  photoItem: {
    width: (width - 40) / 2, // 2 photos per row with margin
    height: (width - 40) / 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  expandedPhotoItem: {
    width: (width - 48) / 2, // 2 photos per row with margin
    height: (width - 48) / 2,
    marginBottom: 12,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
  },
});

export default PhotosTab;
