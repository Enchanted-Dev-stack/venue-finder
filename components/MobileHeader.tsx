import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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

  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
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
              <Ionicons name="notifications" size={22} color="#000" />
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
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
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
    borderBottomColor: "#e5e7eb",
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
