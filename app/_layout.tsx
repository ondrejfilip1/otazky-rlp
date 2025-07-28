import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const lightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#155dfc",
    },
  };

  const darkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#3b82f6",
    },
  };

  const [loaded] = useFonts({
    Inter: require("../assets/fonts/Inter.ttf"),
  });

  const router = useRouter();

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

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
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[lessonNumber]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
