"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"

type Category = {
  id: string
  name: string
  icon: string | JSX.Element
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
              Platform.OS === 'ios' ? 'rgba(242, 242, 247, 0.8)' : '#F2F2F7',
              Platform.OS === 'ios' ? 'rgba(242, 242, 247, 0.9)' : '#F2F2F7'
            ]
          }),
          borderColor: animatedValues[category.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', Platform.OS === 'ios' ? 'rgba(0, 122, 255, 0.2)' : '#007AFF20']
          }),
          transform: [{
            scale: animatedValues[category.id].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02]
            })
          }]
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
                    outputRange: ['#FFFFFF', Platform.OS === 'ios' ? 'rgba(0, 122, 255, 0.1)' : '#007AFF10']
                  })
                }
              ]}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={isSelected ? "#007AFF" : "#8E8E93"}
                />
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.categoryName,
                  {
                    color: animatedValues[category.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#8E8E93', '#007AFF']
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Android elevation
    elevation: 1,
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

