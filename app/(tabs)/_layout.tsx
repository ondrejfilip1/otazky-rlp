import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { BookOpen, GraduationCap, House, User } from "lucide-react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: theme.background,
            borderTopColor: theme.border
          },
          default: {
            backgroundColor: theme.background,
            borderTopColor: theme.border
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Lekce",
          tabBarIcon: ({ color }) => <GraduationCap size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
