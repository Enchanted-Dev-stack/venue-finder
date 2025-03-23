"use client"

import { useState, useRef } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, Switch, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"

type SearchBarProps = {
  style?: object
}

export default function SearchBar({ style }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filterVisible, setFilterVisible] = useState(false)
  const [priceRange, setPriceRange] = useState(50)
  const [distance, setDistance] = useState(5)
  const [openNow, setOpenNow] = useState(false)
  const [reservations, setReservations] = useState(false)
  const [outdoor, setOutdoor] = useState(false)
  const [wifi, setWifi] = useState(false)

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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Text style={styles.modalSubtitle}>Refine your search results with these filters.</Text>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>$</Text>
                <Text style={styles.sliderLabel}>$$$</Text>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Distance</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                step={1}
                value={distance}
                onValueChange={setDistance}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor="#e5e7eb"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Nearby</Text>
                <Text style={styles.sliderLabel}>20 miles</Text>
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
                onPress={() => {
                  setPriceRange(50)
                  setDistance(5)
                  setOpenNow(false)
                  setReservations(false)
                  setOutdoor(false)
                  setWifi(false)
                }}
              >
                <Text style={styles.outlineButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setFilterVisible(false)}>
                <Text style={styles.primaryButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 20,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontFamily: "Outfitsemibold",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    fontFamily: "Outfitmedium",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    marginBottom: 0,
    fontFamily: "Outfitmedium",
  },
  slider: {
    width: "100%",
    height: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: "Handjet",
    color: "#6b7280",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: "Outfitlight",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: "auto",
  },
  button: {
    paddingVertical: 10,
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
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
})

