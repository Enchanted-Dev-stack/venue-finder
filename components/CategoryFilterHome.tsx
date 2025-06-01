"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from "react-native-reanimated"

type Category = {
  id: string
  name: string
  icon: string
  textWidth?: number
}

// Define category-specific theme colors with more vibrant colors
const categoryColors = {
  all: { color: '#007AFF' },
  restaurants: { color: '#FF9500' },
  cafes: { color: '#AF52DE' },
  bars: { color: '#5856D6' },
  gaming: { color: '#32D74B' },
  pizza: { color: '#FF3B30' },
  music: { color: '#FF2D55' }
}

// Calculate approximate text width based on character count
const getTextWidth = (text: string): number => {
  // Average width per character (in pixels) - can be adjusted
  const avgCharWidth = 8;
  // Base padding (left and right) + icon width + icon margin
  const basePadding = 24 + 20 + 8;
  // Calculate text width + add padding + some buffer
  return Math.min(Math.max(text.length * avgCharWidth + basePadding, 80), 160);
};

const categories: Category[] = [
  { id: "all", name: "All", icon: "grid-outline" },
  { id: "restaurants", name: "Restaurants", icon: "restaurant-outline" },
  { id: "cafes", name: "Cafes", icon: "cafe-outline" },
  { id: "bars", name: "Bars", icon: "wine-outline" },
  { id: "gaming", name: "Gaming", icon: "game-controller-outline" },
  { id: "pizza", name: "Pizza", icon: "pizza-outline" },
  { id: "music", name: "Live Music", icon: "musical-notes-outline" }
].map(category => ({
  ...category,
  textWidth: getTextWidth(category.name)
}))

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Animation configuration
  const springConfig = {
    damping: 15,
    stiffness: 120,
    mass: 1,
    overshootClamping: false
  }

  // Get color for the category
  const getCategoryColor = (categoryId: string, isSelected: boolean) => {
    const colorInfo = categoryColors[categoryId as keyof typeof categoryColors]
    if (isSelected) {
      return colorInfo?.color || '#007AFF'
    }
    return isDark ? '#aaaaaa' : '#8E8E93' // Default color
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      decelerationRate="fast"
    >
      {categories.map((category) => {
        // Track this category's selected state with a shared value
        const isActive = useSharedValue(category.id === selectedCategory ? 1 : 0)
        const categoryColor = getCategoryColor(category.id, category.id === selectedCategory)
        
        // Animated styles for the button
        const animatedButtonStyle = useAnimatedStyle(() => {
          return {
            width: withSpring(
              isActive.value ? (category.textWidth || 130) : 44,
              springConfig
            ),
            transform: [{ 
              scale: withSpring(
                isActive.value ? 1.05 : 1, 
                springConfig
              ) 
            }],
            borderColor: interpolateColor(
              isActive.value,
              [0, 1],
              [
                isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                categoryColors[category.id as keyof typeof categoryColors]?.color || '#007AFF'
              ]
            )
          }
        })
        
        // Animated styles for the text
        const animatedTextStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(isActive.value, { duration: 200 }),
            transform: [{ 
              translateX: withSpring(
                isActive.value ? 0 : -10, 
                springConfig
              ) 
            }]
          }
        })
        
        // Handle selection
        const handlePress = () => {
          // Update all categories' animation values
          categories.forEach(c => {
            if (c.id === category.id) {
              isActive.value = 1
            } else if (c.id === selectedCategory) {
              // We need a way to access the previous selected category's isActive value
              // This is handled through the state update below
            }
          })
          
          // Update state (which will trigger re-render and update isActive values)
          setSelectedCategory(category.id)
        }
        
        // Update animation value when selected category changes
        if (category.id === selectedCategory && isActive.value !== 1) {
          isActive.value = 1
        } else if (category.id !== selectedCategory && isActive.value !== 0) {
          isActive.value = 0
        }
        
        return (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            onPress={handlePress}
          >
            <Animated.View 
              style={[
                styles.categoryButton,
                { backgroundColor: isDark ? 'rgba(50,50,50,0.4)' : 'rgba(250,250,250,0.8)' },
                animatedButtonStyle
              ]}
            >
              <View style={styles.contentContainer}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={categoryColor}
                  style={styles.icon}
                />
                
                <Animated.Text 
                  style={[
                    styles.categoryName,
                    { color: categoryColor, marginLeft: 8 },
                    animatedTextStyle
                  ]}
                  numberOfLines={1}
                >
                  {category.name}
                </Animated.Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 10,
    alignItems: 'center'
  },
  categoryButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    // Light container shadow
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.08,
    // shadowRadius: 2,
    // Light Android elevation
    // elevation: 1,
  },
  selectedButton: {
    transform: [{ scale: 1.05 }],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 12,
  },
  icon: {
    width: 20,
    height: 20,
    textAlign: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? undefined : 'Outfitmedium',
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  }
})
