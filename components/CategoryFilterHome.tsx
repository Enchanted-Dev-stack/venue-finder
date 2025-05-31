"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"

type Category = {
  id: string
  name: string
  icon: string | JSX.Element
}

// Define category-specific theme colors
const categoryColors = {
  all: { color: '#007AFF', lightBg: 'rgba(0, 122, 255, 0.1)', darkBg: 'rgba(0, 122, 255, 0.2)' },
  restaurants: { color: '#FF9500', lightBg: 'rgba(255, 149, 0, 0.1)', darkBg: 'rgba(255, 149, 0, 0.2)' },
  cafes: { color: '#AF52DE', lightBg: 'rgba(175, 82, 222, 0.1)', darkBg: 'rgba(175, 82, 222, 0.2)' },
  bars: { color: '#5856D6', lightBg: 'rgba(88, 86, 214, 0.1)', darkBg: 'rgba(88, 86, 214, 0.2)' },
  gaming: { color: '#32D74B', lightBg: 'rgba(50, 215, 75, 0.1)', darkBg: 'rgba(50, 215, 75, 0.2)' },
  pizza: { color: '#FF3B30', lightBg: 'rgba(255, 59, 48, 0.1)', darkBg: 'rgba(255, 59, 48, 0.2)' },
  music: { color: '#FF2D55', lightBg: 'rgba(255, 45, 85, 0.1)', darkBg: 'rgba(255, 45, 85, 0.2)' },
}

const categories: Category[] = [
  {
    id: "all",
    name: "All",
    icon: "grid-outline",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: "restaurant-outline",
  },
  {
    id: "cafes",
    name: "Cafes",
    icon: "cafe-outline",
  },
  {
    id: "bars",
    name: "Bars",
    icon: "wine-outline",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "game-controller-outline",
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "pizza-outline",
  },
  {
    id: "music",
    name: "Live Music",
    icon: "musical-notes-outline",
  },
]

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const colorScheme = useColorScheme()
  
  // Theme colors
  const themeColors = {
    background: colorScheme === 'dark' ? '#121212' : '#fff',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#aaaaaa' : '#8E8E93',
    buttonBackground: colorScheme === 'dark' ? 'rgba(50, 50, 50, 0.8)' : 'rgba(242, 242, 247, 0.8)',
    buttonBackgroundSelected: colorScheme === 'dark' ? 'rgba(50, 50, 50, 0.9)' : 'rgba(242, 242, 247, 0.9)',
    buttonBorder: colorScheme === 'dark' ? 'rgba(80, 80, 80, 0.2)' : 'transparent',
    buttonBorderSelected: colorScheme === 'dark' ? 'rgba(0, 122, 255, 0.4)' : 'rgba(0, 122, 255, 0.2)',
    iconBackground: colorScheme === 'dark' ? '#2c2c2c' : '#FFFFFF',
    iconBackgroundSelected: colorScheme === 'dark' ? 'rgba(0, 122, 255, 0.2)' : 'rgba(0, 122, 255, 0.1)',
    iconColor: colorScheme === 'dark' ? '#999999' : '#8E8E93',
    shadow: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
  }
  
  // Get color for specific category
  const getCategoryColor = (categoryId: string, isSelected: boolean) => {
    const defaultColor = '#8E8E93'
    const colorInfo = categoryColors[categoryId as keyof typeof categoryColors]
    return isSelected ? colorInfo?.color || '#007AFF' : defaultColor
  }
  
  // Get background color for specific category
  const getCategoryBgColor = (categoryId: string, isSelected: boolean) => {
    const colorInfo = categoryColors[categoryId as keyof typeof categoryColors]
    const isDark = colorScheme === 'dark'
    
    if (isSelected) {
      return isDark ? colorInfo?.darkBg || 'rgba(0, 122, 255, 0.2)' : colorInfo?.lightBg || 'rgba(0, 122, 255, 0.1)'
    }
    return isDark ? '#2c2c2c' : '#FFFFFF'
  }
  
  // Get border color for specific category
  const getCategoryBorderColor = (categoryId: string, isSelected: boolean) => {
    const colorInfo = categoryColors[categoryId as keyof typeof categoryColors]
    if (isSelected) {
      return `${colorInfo?.color}40` || 'rgba(0, 122, 255, 0.4)' // 40 = 25% opacity in hex
    }
    return colorScheme === 'dark' ? 'rgba(80, 80, 80, 0.2)' : 'transparent'
  }
  
  const animatedValues = useRef(
    categories.reduce((acc, category) => {
      acc[category.id] = new Animated.Value(category.id === "all" ? 1 : 0)
      return acc
    }, {} as Record<string, Animated.Value>)
  ).current

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Animate previous selection out
    Animated.timing(animatedValues[selectedCategory], {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
    
    // Animate new selection in
    Animated.timing(animatedValues[categoryId], {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
      decelerationRate="fast"
      snapToAlignment="center"
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id
        
        const animatedStyle = {
          backgroundColor: animatedValues[category.id].interpolate({
            inputRange: [0, 1],
            outputRange: [
              themeColors.buttonBackground,
              themeColors.buttonBackgroundSelected
            ]
          }),
          borderColor: animatedValues[category.id].interpolate({
            inputRange: [0, 1],
            outputRange: [
              getCategoryBorderColor(category.id, false),
              getCategoryBorderColor(category.id, true)
            ]
          }),
          transform: [{
            scale: animatedValues[category.id].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05]
            })
          }],
          elevation: animatedValues[category.id].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 4]
          })
        }
        
        return (
          <Animated.View key={category.id} style={[styles.categoryButton, animatedStyle]}>
            <TouchableOpacity
              style={{ width: '100%', alignItems: 'center' }}
              activeOpacity={0.7}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Animated.View style={[
                styles.iconContainer,
                {
                  backgroundColor: animatedValues[category.id].interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      themeColors.iconBackground,
                      getCategoryBgColor(category.id, true)
                    ]
                  })
                }
              ]}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={getCategoryColor(category.id, isSelected)}
                />
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.categoryName,
                  {
                    color: animatedValues[category.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [themeColors.textSecondary, getCategoryColor(category.id, true)]
                    })
                  }
                ]}
                numberOfLines={1}
              >
                {category.name}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
  },
  categoryButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    aspectRatio: 1,
    borderWidth: 1,
    marginHorizontal: 4,
    // iOS-style shadow (only for the button)
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    // Android elevation
    elevation: 1,
    // shadowColor, shadowOpacity, backgroundColor, and borderColor handled dynamically
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    letterSpacing: -0.2,
    fontFamily: Platform.OS === 'ios' ? undefined : 'Outfitmedium',
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
})

