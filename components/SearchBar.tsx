"use client"

import { useState, useRef, useCallback } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, Switch, Pressable, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"

type SearchBarProps = {
  style?: object
}

export default function SearchBar({ style }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filterVisible, setFilterVisible] = useState(false)
  
  // External values used for display
  const [priceDisplay, setPriceDisplay] = useState(50)
  const [distanceDisplay, setDistanceDisplay] = useState(5)
  
  // Internal values used for the sliders
  const [priceSliderValue, setPriceSliderValue] = useState(50)
  const [distanceSliderValue, setDistanceSliderValue] = useState(5)
  
  // Feature switches
  const [openNow, setOpenNow] = useState(false)
  const [reservations, setReservations] = useState(false)
  const [outdoor, setOutdoor] = useState(false)
  const [wifi, setWifi] = useState(false)
  
  // Handle price slider change (only update display value)
  const handlePriceChange = useCallback((value: number) => {
    // Update only the display value during dragging
    setPriceDisplay(Math.round(value))
  }, [])
  
  // Handle distance slider change (only update display value)
  const handleDistanceChange = useCallback((value: number) => {
    // Update only the display value during dragging
    setDistanceDisplay(Math.round(value))
  }, [])
  
  // When sliding is complete, update both values
  const handlePriceSlidingComplete = useCallback((value: number) => {
    const roundedValue = Math.round(value)
    setPriceDisplay(roundedValue)
    setPriceSliderValue(roundedValue)
  }, [])
  
  // When sliding is complete, update both values
  const handleDistanceSlidingComplete = useCallback((value: number) => {
    const roundedValue = Math.round(value)
    setDistanceDisplay(roundedValue)
    setDistanceSliderValue(roundedValue)
  }, [])
  
  // Reset all filter values
  const handleReset = useCallback(() => {
    setPriceDisplay(50)
    setPriceSliderValue(50)
    setDistanceDisplay(5)
    setDistanceSliderValue(5)
    setOpenNow(false)
    setReservations(false)
    setOutdoor(false)
    setWifi(false)
  }, [])

  // Apply the current filter values
  const handleApplyFilters = useCallback(() => {
    // Update slider values to match display values
    setPriceSliderValue(priceDisplay)
    setDistanceSliderValue(distanceDisplay)
    // Close the modal
    setFilterVisible(false)
  }, [priceDisplay, distanceDisplay])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search venues..."
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Text style={styles.modalSubtitle}>Refine your search results with these filters.</Text>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <Text style={styles.filterTitle}>Price Range</Text>
                <Text style={styles.sliderValue}>${priceDisplay}</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                {Platform.OS === 'android' ? (
                  // For Android, we need a simpler approach to avoid flickering
                  <View style={styles.androidSliderWrapper}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={priceSliderValue}
                      onValueChange={handlePriceChange}
                      onSlidingComplete={handlePriceSlidingComplete}
                      minimumTrackTintColor="#3b82f6"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#3b82f6"
                    />
                  </View>
                ) : (
                  // iOS slider works better with animation
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={priceSliderValue}
                    onValueChange={handlePriceChange}
                    onSlidingComplete={handlePriceSlidingComplete}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#3b82f6"
                    tapToSeek={true}
                  />
                )}
                
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>$</Text>
                  <Text style={styles.sliderLabel}>$$$</Text>
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <Text style={styles.filterTitle}>Distance</Text>
                <Text style={styles.sliderValue}>{distanceDisplay} mi</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                {Platform.OS === 'android' ? (
                  // For Android, we need a simpler approach to avoid flickering
                  <View style={styles.androidSliderWrapper}>
                    <Slider
                      style={styles.slider}
                      minimumValue={1}
                      maximumValue={20}
                      step={1}
                      value={distanceSliderValue}
                      onValueChange={handleDistanceChange}
                      onSlidingComplete={handleDistanceSlidingComplete}
                      minimumTrackTintColor="#3b82f6"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#3b82f6"
                    />
                  </View>
                ) : (
                  // iOS slider works better with animation
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={20}
                    step={1}
                    value={distanceSliderValue}
                    onValueChange={handleDistanceChange}
                    onSlidingComplete={handleDistanceSlidingComplete}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#3b82f6"
                    tapToSeek={true}
                  />
                )}
                
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>Nearby</Text>
                  <Text style={styles.sliderLabel}>20 miles</Text>
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Features</Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Open Now</Text>
                <Switch
                  value={openNow}
                  onValueChange={setOpenNow}
                  trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
                  thumbColor={openNow ? "#3b82f6" : "#f4f3f4"}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Accepts Reservations</Text>
                <Switch
                  value={reservations}
                  onValueChange={setReservations}
                  trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
                  thumbColor={reservations ? "#3b82f6" : "#f4f3f4"}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Outdoor Seating</Text>
                <Switch
                  value={outdoor}
                  onValueChange={setOutdoor}
                  trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
                  thumbColor={outdoor ? "#3b82f6" : "#f4f3f4"}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Free WiFi</Text>
                <Switch
                  value={wifi}
                  onValueChange={setWifi}
                  trackColor={{ false: "#e5e7eb", true: "#bfdbfe" }}
                  thumbColor={wifi ? "#3b82f6" : "#f4f3f4"}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={handleReset}
              >
                <Text style={styles.outlineButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={handleApplyFilters}
              >
                <Text style={styles.primaryButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
  },
  modalHeader: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 2,
    fontFamily: "Outfitsemibold",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Outfitmedium",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: "Outfitmedium",
    color: "#1f2937",
  },
  sliderContainer: {
    marginVertical: 5,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 0,
  },
  androidSliderWrapper: {
    // Android-specific wrapper to reduce re-renders
    overflow: 'hidden',
    marginVertical: 5,
  },
  slider: {
    width: "100%",
    height: 36,
    ...(Platform.OS === 'android' ? {
      padding: 0,
      // This is important to avoid Android slider jumpiness
      opacity: 0.99,
    } : {}),
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: "Outfitmedium",
    color: "#3b82f6",
    textAlign: "right",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: "Outfitregular",
    color: "#6b7280",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingBottom: 0,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: "Outfitmedium",
    color: "#4b5563",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
  },
  outlineButtonText: {
    color: "#000",
    fontFamily: "Outfitmedium",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Outfitmedium",
  },
});

