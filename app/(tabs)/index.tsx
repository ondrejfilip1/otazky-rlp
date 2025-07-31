import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lessonList from "@/utils/lessonMap";
import LessonBox from "@/components/LessonBox";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedText from "@/components/ThemedText";
import { Brain, GraduationCap } from "lucide-react-native";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const [hardQuestions, setHardQuestions] = useState({});
  const { colors, dark } = useTheme();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const usernameData = await AsyncStorage.getItem("username");
    if (usernameData) setUsername(usernameData);

    const hardQuestionsData = await AsyncStorage.getItem("hardQuestions");
    if (hardQuestionsData) setHardQuestions(JSON.parse(hardQuestionsData));
    console.log(hardQuestionsData);
  };

  return (
    <SafeAreaView
      style={{
        padding: 16,
        backgroundColor: colors.background,
        height: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <ThemedText style={{ fontSize: 24 }}>Lekce</ThemedText>
        <GraduationCap
          style={{ marginLeft: "auto" }}
          color={colors.onBackground}
        />
      </View>
      {Object.entries(lessonList).map(([lessonID, value]) => (
        <LessonBox
          name={value.nazev}
          lessonID={lessonID}
          questionCount={value.otazky.length}
          key={lessonID}
        />
      ))}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <ThemedText style={{ fontSize: 24 }}>Problémové otázky</ThemedText>
        <Brain style={{ marginLeft: "auto" }} color={colors.onBackground} />
      </View>
      {Object.entries(hardQuestions).map(([lessonID, questions]) => (
        <LessonBox
          name={lessonList[lessonID].nazev}
          lessonID={`${lessonID}?hardLesson=true`}
          questionCount={Array.isArray(questions) ? questions.length : 0}
          key={lessonID}
        />
      ))}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
