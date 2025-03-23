"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

type Category = {
  id: string
  name: string
  icon: string | JSX.Element
}

const categories: Category[] = [
  {
    id: "restaurants",
    name: "Restaurants",
    icon: "silverware-clean",
  },
  {
    id: "cafes",
    name: "Cafes",
    icon: "cafe",
  },
  {
    id: "bars",
    name: "Bars",
    icon: "wine",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "game-controller",
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "pizza",
  },
  {
    id: "music",
    name: "Live Music",
    icon: "musical-notes",
  },
]

export default function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryButton, selectedCategory === category.id && styles.selectedCategoryButton]}
          onPress={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
        >
          <View style={styles.iconContainer}>
          {category.id === 'restaurants' ? (
              <MaterialCommunityIcons
                name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={20}
                color={selectedCategory === category.id ? "#fff" : "#000"}
              />
            ) : (
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={selectedCategory === category.id ? "#fff" : "#000"}
              />
            )}
          </View>
          <Text style={[styles.categoryName, selectedCategory === category.id && styles.selectedCategoryName]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 12,
  },
  categoryButton: {
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
  },
  selectedCategoryButton: {
    backgroundColor: "#3b82f6",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectedCategoryName: {
    color: "#fff",
  },
})

