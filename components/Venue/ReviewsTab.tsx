import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Venue {
  _id: string;
  name: string;
  averageRating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsTabProps {
  venue: Venue;
  expanded: boolean;
}

const ReviewsTab = ({ venue, expanded }: ReviewsTabProps) => {
  // In production, you would fetch reviews from an API
  // For now, we'll create a placeholder if there are no reviews
  const mockReviews = [
    {
      id: "r1",
      user: "Alex Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely love this place! The atmosphere is amazing and the staff is super friendly.",
    },
    {
      id: "r2",
      user: "Sam Smith",
      rating: 4,
      date: "1 month ago",
      comment: "Great for events. The venue was perfect for our company gathering.",
    },
  ];

  const reviews = mockReviews; // Replace with actual reviews when available
  const rating = venue.averageRating || 4.5;
  const reviewCount = venue.reviewCount || reviews.length;

  return (
    <ScrollView 
      style={[styles.tabContent, expanded && styles.expandedContent]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.reviewSummary}>
        <View style={styles.reviewRating}>
          <Text style={styles.reviewRatingNumber}>{rating.toFixed(1)}</Text>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={16}
                color={star <= Math.floor(rating) ? "#FFCA28" : "#e5e7eb"}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
        </View>
        <TouchableOpacity style={styles.writeReviewButton}>
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsList}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={14} color={star <= review.rating ? "#FFCA28" : "#e5e7eb"} />
                ))}
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No reviews yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
    backgroundColor: "#fff",
  },
  expandedContent: {
    minHeight: height - 50, // Adjusted for tab bar height
  },
  reviewSummary: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  reviewRating: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  reviewRatingNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: "row",
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  writeReviewButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
  },
  writeReviewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  reviewsList: {
    marginTop: 8,
  },
  reviewItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  reviewDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
    marginTop: 8,
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

export default ReviewsTab;
