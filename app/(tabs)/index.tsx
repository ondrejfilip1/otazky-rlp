import LessonBox from "@/components/LessonBox";
import ThemedText from "@/components/ThemedText";
import { hardQuestionsEvent } from "@/utils/Events";
import LessonList from "@/utils/LessonList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Brain, GraduationCap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [hardQuestions, setHardQuestions] = useState({});
  const { colors } = useTheme();

  const load = async () => {
    const hardQuestionsData = await AsyncStorage.getItem("hardQuestions");
    if (hardQuestionsData) setHardQuestions(JSON.parse(hardQuestionsData));
    else setHardQuestions([]);
    //console.log(hardQuestionsData);
  };

  useEffect(() => {
    load();
    hardQuestionsEvent.on("update", load);
    return () => {
      hardQuestionsEvent.off("update", load);
    };
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <SafeAreaView
        style={{
          padding: 16,
          height: "100%",
          maxWidth: 600,
          width: "100%",
          marginHorizontal: "auto",
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
        <View style={{ gap: 12 }}>
          {Object.entries(LessonList).map(([lessonID, value]) => (
            <LessonBox
              name={value.nazev}
              lessonID={lessonID}
              questionCount={value.otazky.length}
              key={lessonID}
            />
          ))}
        </View>
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
        <View style={{ gap: 12 }}>
          {Object.keys(hardQuestions).length === 0 ? (
            <ThemedText
              style={{ textAlign: "center", opacity: 0.6, marginVertical: 24 }}
            >
              Nemáte žádné problémové otázky
            </ThemedText>
          ) : (
            <>
              {Object.entries(hardQuestions).map(([lessonID, questions]) => (
                <LessonBox
                  name={LessonList[lessonID].nazev}
                  lessonID={`${lessonID}?hardLesson=true`}
                  questionCount={
                    Array.isArray(questions) ? questions.length : 0
                  }
                  key={lessonID}
                />
              ))}
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
