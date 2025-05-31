import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";

type MobileHeaderProps = {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showSearchIcon?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
};

export default function MobileHeader({
  title = "Venue Finder",
  showBack = false,
  showSearch = true,
  showSearchIcon = false,
  showNotification = true,
  showProfile = true,
}: MobileHeaderProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
  // Theme colors
  const themeColors = {
    background: colorScheme === 'dark' ? '#121212' : '#fff',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
    subText: colorScheme === 'dark' ? '#cccccc' : '#666666',
    border: colorScheme === 'dark' ? '#333333' : '#e5e7eb',
    icon: colorScheme === 'dark' ? '#ffffff' : '#000000',
  };

  return (
    <>
      <View style={[styles.header, { backgroundColor: themeColors.background, borderBottomColor: themeColors.border }]}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color={themeColors.icon} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          {/* {showSearchIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("Main", { screen: "Search" })}
            >
              <Ionicons name="search" size={22} color="#000" />
            </TouchableOpacity>
          )} */}
          {showNotification && (
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={22} color={themeColors.icon} />
            </TouchableOpacity>
          )}
          {showProfile && (
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={{ uri: "https://i.pravatar.cc/300" }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showSearch && <SearchBar style={styles.searchBar}/>}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    // borderBottomWidth: 1,
    // borderBottomColor and backgroundColor are now handled dynamically
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    // borderBottomColor is now handled dynamically
  },
  backButton: {
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Pacifico",
    // color is now handled dynamically
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});
