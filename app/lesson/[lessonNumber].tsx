import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useLocalSearchParams, useRouter } from "expo-router";
import lessonList from "@/utils/lessonMap";
import {
  Button,
  Dialog,
  IconButton,
  MD2Colors,
  Portal,
  ProgressBar,
  Tooltip,
  Text,
  useTheme,
} from "react-native-paper";
import { Check, Flag, X } from "lucide-react-native";
import ThemedText from "@/components/ThemedText";
import ScoreCircle from "@/components/ui/ScoreCircle";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Question = {
  ot: string;
  od1: string;
  od2: string;
  od3: string;
  spr: string;
};

const LessonScreen = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { lessonNumber, hardLesson } = useLocalSearchParams();
  const [numberArray, setNumberArray] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctlyAnswered, setCorrectlyAnswered] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);

  const router = useRouter();
  const { colors, dark } = useTheme();

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    try {
      if (!lessonNumber) return;

      const lesson = lessonList[lessonNumber as string];
      let allQuestions: Question[] = [];

      if (hardLesson) {
        const hardQuestions = await AsyncStorage.getItem("hardQuestions");

        if (hardQuestions) {
          const hardQuestionsArray =
            JSON.parse(hardQuestions)[lessonNumber as string];

          let finalArray: Question[] = [];
          lesson.otazky.map((value: Question, index: number) => {
            if (hardQuestionsArray.includes(index)) finalArray.push(value);
          });
          allQuestions = finalArray;
          setQuestions(finalArray);
          const arr = [...Array(finalArray.length).keys()];
          setNumberArray(arr);
          setTotalQuestions(finalArray.length);
        }
      } else {
        allQuestions = lesson.otazky;
      }

      setQuestions(allQuestions);
      const arr = [...Array(allQuestions.length).keys()];
      setNumberArray(arr);
      setTotalQuestions(allQuestions.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log(numberArray);
    if (numberArray && numberArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * numberArray.length);
      setCurrentIndex(numberArray[randomIndex]);
      setHasAnswered(false);
    }
  }, [numberArray]);

  const handleAnswer = (correct: boolean) => {
    setHasAnswered(true);
    if (hasAnswered) return;
    if (correct) setCorrectlyAnswered((prev) => prev + 1);
    else addQuestionToList();
  };

  const handleContinue = (skip?: boolean) => {
    if (skip) addQuestionToList();

    if (currentIndex !== undefined)
      setNumberArray((prev) => prev.filter((item) => item !== currentIndex));
  };

  const addQuestionToList = async () => {
    if (hardLesson) return;

    try {
      const hardQuestions = await AsyncStorage.getItem("hardQuestions");
      let hardQuestionsJSON = hardQuestions ? JSON.parse(hardQuestions) : {};

      // init array for this lesson if its not already there
      if (!hardQuestionsJSON[lessonNumber as string])
        hardQuestionsJSON[lessonNumber as string] = [];

      if (!hardQuestionsJSON[lessonNumber as string].includes(currentIndex))
        hardQuestionsJSON[lessonNumber as string].push(currentIndex);

      await AsyncStorage.setItem(
        "hardQuestions",
        JSON.stringify(hardQuestionsJSON)
      );
      // console.log(hardQuestionsJSON);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingScreen description="Načítání lekce" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        style={{
          padding: 16,
          flex: 0,
          maxWidth: 600,
          width: "100%",
          marginHorizontal: "auto",
        }}
      >
        {numberArray.length > 0 ? (
          <>
            <ProgressBar
              style={{ height: 6, borderRadius: 6 }}
              progress={(totalQuestions - numberArray.length) / totalQuestions}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Tooltip title="Ukončit lekci">
                <IconButton
                  onPress={() => setDialogVisible(true)}
                  iconColor={dark ? "#90a1b9" : MD2Colors.blue900}
                  icon={(props) => <X {...props} />}
                  style={{
                    backgroundColor: dark ? "#1e293b" : MD2Colors.blue100,
                    marginLeft: 0,
                  }}
                />
              </Tooltip>
              <Portal>
                <Dialog
                  visible={dialogVisible}
                  onDismiss={() => setDialogVisible(false)}
                  style={{
                    maxWidth: 600,
                    width: "100%",
                    marginHorizontal: "auto",
                  }}
                >
                  <Dialog.Title style={{ fontFamily: "Inter" }}>
                    Upozornění
                  </Dialog.Title>
                  <Dialog.Content>
                    <ThemedText>Opravdu chcete ukončit lekci?</ThemedText>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      labelStyle={{ fontFamily: "Inter" }}
                      onPress={() => setDialogVisible(false)}
                    >
                      Zavřít
                    </Button>
                    <Button
                      labelStyle={{ fontFamily: "Inter" }}
                      onPress={() => router.replace("/")}
                      mode="contained"
                    >
                      Ukončit
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Tooltip title="Nevím otázku">
                <IconButton
                  onPress={() => handleContinue(true)}
                  iconColor={dark ? "#90a1b9" : MD2Colors.blue900}
                  icon={(props) => <Flag {...props} />}
                  style={{
                    backgroundColor: dark ? "#1e293b" : MD2Colors.blue100,
                    marginRight: 0,
                  }}
                />
              </Tooltip>
            </View>
            {typeof currentIndex === "number" && questions[currentIndex] && (
              <>
                <ThemedText style={{ fontSize: 32, marginVertical: 24 }}>
                  {questions[currentIndex].ot}
                </ThemedText>

                {["od1", "od2", "od3"].map((value, index) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={index}
                    style={{ marginBottom: 12 }}
                    onPress={() =>
                      handleAnswer(questions[currentIndex]["spr"] === value)
                    }
                  >
                    <View
                      style={{
                        backgroundColor: !hasAnswered
                          ? dark
                            ? "#1e293b"
                            : MD2Colors.blue100
                          : questions[currentIndex]["spr"] === value
                            ? dark
                              ? MD2Colors.green700
                              : MD2Colors.green300
                            : dark
                              ? MD2Colors.red700
                              : MD2Colors.red300,
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <ThemedText style={{ fontSize: 24, marginRight: 12 }}>
                        {["A", "B", "C"][index]}
                      </ThemedText>
                      <ThemedText
                        style={{ fontSize: 14, flexShrink: 1, flex: 1 }}
                      >
                        {questions[currentIndex][value as keyof Question]}
                      </ThemedText>
                      {hasAnswered && (
                        <>
                          {questions[currentIndex]["spr"] === value ? (
                            <Check
                              color={
                                dark ? MD2Colors.green200 : MD2Colors.green800
                              }
                            />
                          ) : (
                            <X
                              color={dark ? MD2Colors.red200 : MD2Colors.red800}
                            />
                          )}
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}

                {hasAnswered && (
                  <Button
                    labelStyle={{ fontFamily: "Inter" }}
                    mode="contained"
                    style={{ backgroundColor: "#155dfc" }}
                    textColor="white"
                    onPress={() => handleContinue()}
                  >
                    Pokračovat
                  </Button>
                )}
              </>
            )}
          </>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <ThemedText style={{ fontSize: 30 }}>Skóre</ThemedText>
            <ScoreCircle
              radius={100}
              strokeWidth={10}
              progress={correctlyAnswered / totalQuestions}
              color={colors.primary}
              style={{ marginVertical: 16 }}
            />
            <Button
              labelStyle={{ fontFamily: "Inter" }}
              mode="contained"
              onPress={() => router.replace("/")}
            >
              Jít zpět
            </Button>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({});
