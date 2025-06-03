import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, SplashScreen as ExpoRouterSplashScreen } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Inner app component that uses the theme context
const ThemedApp = () => {
  // We'll access the theme inside this component after ThemeProvider is available
  return (
    <Stack 
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="MyReviews" />
      <Stack.Screen name="SavedVenues" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="VenueDetail" />
    </Stack>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Handjet: require("../assets/fonts/Handjet-VariableFont_wght.ttf"),
    Rubik: require("../assets/fonts/Rubik-VariableFont_wght.ttf"),
    MavenPro: require("../assets/fonts/MavenPro-VariableFont_wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    Outfit: require("../assets/fonts/Outfit-VariableFont_wght.ttf"),
    //Raleway
    Ralewaynormal: require("../assets/fonts/Raleway/static/Raleway-Black.ttf"),
    Ralewaybold: require("../assets/fonts/Raleway/static/Raleway-Bold.ttf"),
    Ralewaylight: require("../assets/fonts/Raleway/static/Raleway-Light.ttf"),
    Ralewaymedium: require("../assets/fonts/Raleway/static/Raleway-Medium.ttf"),
    Ralewayregular: require("../assets/fonts/Raleway/static/Raleway-Regular.ttf"),
    Ralewaysemibold: require("../assets/fonts/Raleway/static/Raleway-SemiBold.ttf"),
    Ralewaythin: require("../assets/fonts/Raleway/static/Raleway-Thin.ttf"),

    //Poppins
    Poppinsbold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    Poppinslight: require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    Poppinsmedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    Poppinsregular: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    Poppinssemibold: require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    Poppinsthin: require("../assets/fonts/Poppins/Poppins-Thin.ttf"),

    //Montserrat
    Montserratbold: require("../assets/fonts/Montserrat/static/Montserrat-Bold.ttf"),
    Montserratlight: require("../assets/fonts/Montserrat/static/Montserrat-Light.ttf"),
    Montserratmedium: require("../assets/fonts/Montserrat/static/Montserrat-Medium.ttf"),
    Montserratregular: require("../assets/fonts/Montserrat/static/Montserrat-Regular.ttf"),
    Montserratsemibold: require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
    Montserratthin: require("../assets/fonts/Montserrat/static/Montserrat-Thin.ttf"),

    //MavenPro
    MavenProbold: require("../assets/fonts/Maven_Pro/static/MavenPro-Bold.ttf"),
    MavenPromedium: require("../assets/fonts/Maven_Pro/static/MavenPro-Medium.ttf"),
    MavenProregular: require("../assets/fonts/Maven_Pro/static/MavenPro-Regular.ttf"),
    MavenProsemibold: require("../assets/fonts/Maven_Pro/static/MavenPro-SemiBold.ttf"),

    //Outfit
    Outfitbold: require("../assets/fonts/Outfit/static/Outfit-Bold.ttf"),
    Outfitlight: require("../assets/fonts/Outfit/static/Outfit-Light.ttf"),
    Outfitmedium: require("../assets/fonts/Outfit/static/Outfit-Medium.ttf"),
    Outfitregular: require("../assets/fonts/Outfit/static/Outfit-Regular.ttf"),
    Outfitsemibold: require("../assets/fonts/Outfit/static/Outfit-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Hide the native splash screen as soon as fonts are loaded
      SplashScreen.hideAsync()
        .then(() => {
          // Hide the expo router splash screen
          ExpoRouterSplashScreen.hideAsync();
          
          // Router will automatically go to the initial route ((tabs) or (auth))
          // based on the auth state through route protection
        })
        .catch(err => {
          console.warn('Error hiding splash screen:', err);
        });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemedApp />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
