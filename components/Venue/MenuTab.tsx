import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import VenueMenu from "@/components/Venue/VenueMenu";

interface Venue {
  _id: string;
  name: string;
}

interface MenuTabProps {
  venue: Venue;
  expanded: boolean;
}

const MenuTab = ({ venue, expanded }: MenuTabProps) => {
  return (
    <View style={[styles.tabContent, expanded && styles.expandedContent]}>
      <VenueMenu venueId={venue._id} />
    </View>
  );
};

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  expandedContent: {
    minHeight: height - 50, // Adjusted for tab bar height
  },
});

export default MenuTab;
