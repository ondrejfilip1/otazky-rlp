import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

//import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  //const colorScheme = useColorScheme();
  const paperTheme = {
    ...MD3LightTheme,
    fonts: {
      displayLarge: { fontFamily: "Inter", fontWeight: "400" },
      displayMedium: { fontFamily: "Inter", fontWeight: "400" },
      displaySmall: { fontFamily: "Inter", fontWeight: "400" },
      headlineLarge: { fontFamily: "Inter", fontWeight: "400" },
      headlineMedium: { fontFamily: "Inter", fontWeight: "400" },
      headlineSmall: { fontFamily: "Inter", fontWeight: "400" },
      titleLarge: { fontFamily: "Inter", fontWeight: "400" },
      titleMedium: { fontFamily: "Inter", fontWeight: "400" },
      titleSmall: { fontFamily: "Inter", fontWeight: "400" },
      labelLarge: { fontFamily: "Inter", fontWeight: "400" },
      labelMedium: { fontFamily: "Inter", fontWeight: "400" },
      labelSmall: { fontFamily: "Inter", fontWeight: "400" },
      bodyLarge: { fontFamily: "Inter", fontWeight: "400" },
      bodyMedium: { fontFamily: "Inter", fontWeight: "400" },
      bodySmall: { fontFamily: "Inter", fontWeight: "400" },
    },
  };

  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    const data = await AsyncStorage.getItem("username");
    if (!data) router.replace("/welcome");
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
