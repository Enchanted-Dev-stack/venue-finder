"use client"

import { useState, useRef, useCallback } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, Switch, Pressable, Platform, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"

type SearchBarProps = {
  style?: object
}

export default function SearchBar({ style }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filterVisible, setFilterVisible] = useState(false)
  const colorScheme = useColorScheme()
  
  // Theme colors
  const themeColors = {
    background: colorScheme === 'dark' ? '#121212' : '#fff',
    searchBackground: colorScheme === 'dark' ? '#2c2c2c' : '#f3f4f6',
    modalBackground: colorScheme === 'dark' ? '#1e1e1e' : 'white',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
    placeholderText: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
    textSecondary: colorScheme === 'dark' ? '#a3a3a3' : '#6b7280',
    textTertiary: colorScheme === 'dark' ? '#737373' : '#4b5563',
    border: colorScheme === 'dark' ? '#333333' : '#f3f4f6',
    switchTrackOff: colorScheme === 'dark' ? '#525252' : '#e5e7eb',
    switchTrackOn: colorScheme === 'dark' ? '#3b82f6' : '#bfdbfe',
    switchThumbOff: colorScheme === 'dark' ? '#a3a3a3' : '#f4f3f4',
    switchThumbOn: colorScheme === 'dark' ? '#3b82f6' : '#3b82f6',
    buttonPrimary: colorScheme === 'dark' ? '#3b82f6' : '#3b82f6',
    buttonOutline: colorScheme === 'dark' ? '#333333' : '#d1d5db',
    modalOverlay: 'rgba(0, 0, 0, 0.5)'
  }
  
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
      <View style={[styles.searchContainer, { backgroundColor: themeColors.searchBackground }]}>
        <Ionicons name="search" size={20} color={themeColors.placeholderText} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder="Search venues..."
          placeholderTextColor={themeColors.placeholderText}
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options" size={20} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: themeColors.modalOverlay }]} onPress={() => setFilterVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: themeColors.modalBackground }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Filters</Text>
              <Text style={[styles.modalSubtitle, { color: themeColors.textSecondary }]}>Refine your search results with these filters.</Text>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <Text style={[styles.filterTitle, { color: themeColors.text }]}>Price Range</Text>
                <Text style={[styles.sliderValue, { color: themeColors.buttonPrimary }]}>Up to ${priceDisplay}</Text>
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
                  <Text style={[styles.sliderLabel, { color: themeColors.textSecondary }]}>$</Text>
                  <Text style={[styles.sliderLabel, { color: themeColors.textSecondary }]}>$$</Text>
                  <Text style={[styles.sliderLabel, { color: themeColors.textSecondary }]}>$$$</Text>
                  <Text style={[styles.sliderLabel, { color: themeColors.textSecondary }]}>$$$$</Text>
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
                <Text style={[styles.switchLabel, { color: themeColors.textTertiary }]}>Open now</Text>
                <Switch
                  value={openNow}
                  onValueChange={setOpenNow}
                  trackColor={{ false: themeColors.switchTrackOff, true: themeColors.switchTrackOn }}
                  thumbColor={openNow ? themeColors.switchThumbOn : themeColors.switchThumbOff}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: themeColors.textTertiary }]}>Accepts reservations</Text>
                <Switch
                  value={reservations}
                  onValueChange={setReservations}
                  trackColor={{ false: themeColors.switchTrackOff, true: themeColors.switchTrackOn }}
                  thumbColor={reservations ? themeColors.switchThumbOn : themeColors.switchThumbOff}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: themeColors.textTertiary }]}>Outdoor seating</Text>
                <Switch
                  value={outdoor}
                  onValueChange={setOutdoor}
                  trackColor={{ false: themeColors.switchTrackOff, true: themeColors.switchTrackOn }}
                  thumbColor={outdoor ? themeColors.switchThumbOn : themeColors.switchThumbOff}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: themeColors.textTertiary }]}>Free WiFi</Text>
                <Switch
                  value={wifi}
                  onValueChange={setWifi}
                  trackColor={{ false: themeColors.switchTrackOff, true: themeColors.switchTrackOn }}
                  thumbColor={wifi ? themeColors.switchThumbOn : themeColors.switchThumbOff}
                />
              </View>
            </View>

            <View style={[styles.buttonContainer, { borderTopColor: themeColors.border }]}>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton, { borderColor: themeColors.buttonOutline }]}
                onPress={handleReset}
              >
                <Text style={[styles.outlineButtonText, { color: themeColors.text }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton, { backgroundColor: themeColors.buttonPrimary }]} 
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
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
    // backgroundColor handled dynamically
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
    // backgroundColor handled dynamically
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: Platform.OS === 'ios' ? '85%' : '90%',
    // backgroundColor handled dynamically
  },
  modalHeader: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 2,
    fontFamily: "Outfitsemibold",
    // color handled dynamically
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Outfitmedium",
    // color handled dynamically
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
    // color handled dynamically
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
    textAlign: "right",
    // color handled dynamically
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: "Outfitregular",
    // color handled dynamically
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
    // color handled dynamically
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    // borderTopColor handled dynamically
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
    // borderColor handled dynamically
  },
  primaryButton: {
    // backgroundColor handled dynamically
  },
  outlineButtonText: {
    fontFamily: "Outfitmedium",
    // color handled dynamically
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Outfitmedium",
  },
});

