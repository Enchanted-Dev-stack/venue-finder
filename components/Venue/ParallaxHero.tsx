import React, { useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedIconButton } from './AnimatedComponents';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

interface ParallaxHeroProps {
  images: string[];
  title: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  onBackPress: () => void;
  onFavoritePress: () => void;
  onSharePress: () => void;
  isFavorite: boolean;
  scrollY: Animated.Value;
}

const ParallaxHero = ({
  images,
  title,
  rating,
  reviewCount,
  address,
  onBackPress,
  onFavoritePress,
  onSharePress,
  isFavorite,
  scrollY,
}: ParallaxHeroProps) => {
  const insets = useSafeAreaInsets();
  const headerHeight = HEADER_HEIGHT;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  
  // Calculate the image translation and opacity
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, headerHeight / 3],
    extrapolate: 'clamp',
  });

  // Calculate the title opacity and translation
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, headerHeight / 2],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [0, -20, -40],
    extrapolate: 'clamp',
  });

  // Header background and buttons opacity
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [0, 0.5, 0.9],
    extrapolate: 'clamp',
  });

  // Dot indicators for multiple images
  const renderDotIndicators = () => {
    if (images.length <= 1) return null;
    
    return (
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              index === 0 && styles.activeDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header background - becomes visible on scroll */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: headerBackgroundOpacity,
            height: insets.top + 60,
          },
        ]}
      />

      {/* Hero image with parallax effect */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            height: headerHeight,
            transform: [{ translateY: imageTranslateY }],
          },
        ]}
      >
        <Image
          source={{
            uri: images[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
          }}
          style={styles.image}
        />
        <View style={styles.overlay} />
        
        {/* Image indicators */}
        {renderDotIndicators()}
      </Animated.View>

      {/* Floating header with buttons */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <AnimatedIconButton
          name="chevron-back"
          size={24}
          color="#fff"
          onPress={onBackPress}
          style={styles.backButton}
        />
        <View style={styles.headerActions}>
          <AnimatedIconButton
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#f43f5e" : "#fff"}
            onPress={onFavoritePress}
            style={styles.actionButton}
          />
          <AnimatedIconButton
            name="share-social"
            size={24}
            color="#fff"
            onPress={onSharePress}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Venue info overlay at bottom of image */}
      <Animated.View
        style={[
          styles.infoOverlay,
          {
            opacity: titleOpacity,
            transform: [
              { translateY: titleTranslateY },
              { scale: titleScale },
            ],
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoRow}>
          {rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFCA28" />
              <Text style={styles.ratingText}>{rating}</Text>
              <Text style={styles.reviewCountText}>
                ({reviewCount || 0} reviews)
              </Text>
            </View>
          )}
          {address && (
            <View style={styles.addressWrapper}>
              <Text style={styles.infoSeparator}>•</Text>
              <View style={styles.addressContainer}>
                <Ionicons name="location" size={14} color="#fff" />
                <Text style={styles.addressText}>{address}</Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    width,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#111',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCountText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 4,
  },
  infoSeparator: {
    color: '#ffffff',
    marginHorizontal: 8,
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  addressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default ParallaxHero;
