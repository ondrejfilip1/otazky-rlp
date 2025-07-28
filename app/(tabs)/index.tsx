import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lessonList from "@/utils/lessonMap";
import LessonBox from "@/components/LessonBox";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedText from "@/components/ThemedText";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const { colors } = useTheme();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) setUsername(data);
  };

  return (
    <SafeAreaView style={{ padding: 16, backgroundColor: colors.background, height: "100%" }}>
      <ThemedText style={{ marginVertical: 12, fontSize: 20}}>Lekce</ThemedText>
      {Object.entries(lessonList).map(([lessonID, value]) => (
        <LessonBox name={value.nazev} lessonID={lessonID} key={lessonID} />
      ))}
      <ThemedText style={{ marginVertical: 12, fontSize: 20}}>Problémové otázky</ThemedText>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
