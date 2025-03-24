import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useSegments, useRouter, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View, Text, StyleSheet, Animated } from 'react-native';

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/contexts/auth";
import LogoSVG from "@/components/LogoSVG";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppSplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Set timeout to finish after 3 seconds
    const timeout = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <LogoSVG width={120} height={120} color="#FFFFFF" />
        <Text style={styles.splashTitle}>Venue Finder</Text>
        <Text style={styles.splashSubtitle}>Discover amazing places</Text>
      </Animated.View>
    </View>
  );
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const [showingSplash, setShowingSplash] = useState(true);
  
  // Handle the splash screen finish
  const handleSplashFinish = () => {
    setShowingSplash(false);
  };

  if (showingSplash) {
    return <AppSplashScreen onFinish={handleSplashFinish} />;
  }

  // After splash, we need to decide which stack to show
  if (isLoading) {
    // Still loading auth state, show a blank screen
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {!user ? (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
              <Stack.Screen name="MyReviews" options={{ headerShown: false }} />
              <Stack.Screen name="SavedVenues" options={{ headerShown: false }} />
              <Stack.Screen name="VenueDetail" options={{ headerShown: false }} />
            </>
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 32,
    fontFamily: 'Pacifico',
    color: 'white',
    marginBottom: 8,
    marginTop: 20,
  },
  splashSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
