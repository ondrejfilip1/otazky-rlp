import DropdownInput from "@/components/DropdownInput";
import LoadingScreen from "@/components/LoadingScreen";
import NumberInput from "@/components/NumberInput";
import TextInputQuestion from "@/components/TextInput";
import ThemedText from "@/components/ThemedText";
import ScoreCircle from "@/components/ui/ScoreCircle";
import LessonList from "@/utils/LessonList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Flag, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  MD2Colors,
  Portal,
  ProgressBar,
  Tooltip,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Question =
  | {
      ot: string;
      od1: string;
      od2: string;
      od3?: string;
      od4?: string;
      od5?: string;
      od6?: string;
      od7?: string;
      spr: string | string[];
      imgPath?: string;
    }
  | {
      ot: string;
      imgPath?: string;
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
  const [lessonName, setLessonName] = useState("");

  // dropdown input questions
  const [isDropDownQuestion, setIsDropDownQuestion] = useState(false);

  // input questions
  const [allCorrect, setAllCorrect] = useState(false);
  const [inputsEmpty, setInputsEmpty] = useState(true);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [inputStates, setInputStates] = useState<boolean[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<(string | number)[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  // multiple answers
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const toggleMultipleAnswers = (index: number, max: number) => {
    if (selectedAnswers.includes(index))
      setSelectedAnswers((old) => old.filter((el) => el !== index));
    else {
      if (selectedAnswers.length >= max) return;
      setSelectedAnswers((old) => [...old, index]);
    }
  };

  /*
  useEffect(() => {
    console.log(selectedAnswers);
  }, [selectedAnswers]);
  */

  const router = useRouter();
  const { colors, dark } = useTheme();

  const checkAllAnswers = () => {
    if (userAnswers.length && userAnswers.every(Boolean)) {
      setAllCorrect(true);
      //console.log(true);
    } else {
      setAllCorrect(false);
      //console.log(false);
    }
  };

  const checkAllEmpty = () => {
    if (inputStates.length && inputStates.includes(false)) {
      setInputsEmpty(true);
      /*
      console.log("All empty: true");
      console.log(inputStates);
      */
    } else {
      setInputsEmpty(false);
      /*
      console.log(inputStates);
      console.log("All empty: false");
      */
    }
  };

  useEffect(() => {
    checkAllAnswers();
  }, [userAnswers]);

  useEffect(() => {
    checkAllEmpty();
  }, [inputStates]);

  const onAnswer = (index: number, isCorrect: boolean) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = isCorrect;
      return newAnswers;
    });
  };

  const handleInputEmpty = (index: number, isEmpty: boolean) => {
    setInputStates((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = isEmpty;
      return newAnswers;
    });
  };

  const renderInputQuestion = (string: string) => {
    const elements = [];
    let currentText = "";
    let inputCounter = 0;

    const segments = string.split(/(<[^>]+>)/);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (segment.startsWith("<") && segment.endsWith(">")) {
        if (currentText) {
          elements.push(
            <ThemedText key={`text_${i}`} style={{ fontSize: 32 }}>
              {currentText}
            </ThemedText>
          );
          currentText = "";
        }

        const index = inputCounter++;
        let correctValue: string | number | null = null;
        let options: string[] = [];

        if (segment.includes("NumberInput")) {
          const match = segment.match(/correct=(\d+)/);
          if (match) {
            correctValue = parseInt(match[1], 10);
            elements.push(
              <NumberInput
                key={`numberinput_${index}_${currentIndex}`}
                correct={correctValue}
                onAnswer={(isCorrect: boolean) => onAnswer(index, isCorrect)}
                onEmpty={(isEmpty: boolean) => handleInputEmpty(index, isEmpty)}
                showAnswer={showAnswers}
                isCorrect={userAnswers[index]}
              />
            );
          }
        } else if (segment.includes("TextInput")) {
          const match = segment.match(/correct="([^"]+)"/);
          if (match) {
            correctValue = match[1];
            elements.push(
              <TextInputQuestion
                key={`textinput_${index}_${currentIndex}`}
                correct={correctValue}
                onAnswer={(isCorrect: boolean) => onAnswer(index, isCorrect)}
                onEmpty={(isEmpty: boolean) => handleInputEmpty(index, isEmpty)}
                showAnswer={showAnswers}
                isCorrect={userAnswers[index]}
              />
            );
          }
        } else if (segment.includes("DropdownInput")) {
          const correctMatch = segment.match(/correct="([^"]+)"/);
          const optionsMatch = segment.match(/options="([^"]+)"/);
          if (correctMatch && optionsMatch) {
            correctValue = correctMatch[1];
            options = optionsMatch[1].split(",");
            elements.push(
              <DropdownInput
                key={`dropdown_${index}_${currentIndex}`}
                correct={correctValue}
                options={options}
                onAnswer={(isCorrect) => onAnswer(index, isCorrect)}
                onEmpty={(isEmpty) => handleInputEmpty(index, isEmpty)}
                showAnswer={showAnswers}
                isCorrect={userAnswers[index]}
              />
            );
          }
        }
      } else {
        currentText += segment;
      }
    }

    if (currentText) {
      elements.push(
        <ThemedText key="finalText" style={{ fontSize: 32 }}>
          {currentText}
        </ThemedText>
      );
    }

    if (currentIndex) {
    }
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          marginVertical: 24,
          position: "relative",
          zIndex: 1000,
          elevation: 1000
        }}
      >
        {elements}
      </View>
    );
  };

  useEffect(() => {
    loadLesson();
  }, []);

  useEffect(() => {
    if (currentIndex !== undefined) {
      setUserAnswers([]);
      setAllCorrect(false);
      setInputStates([]);
      setInputsEmpty(true);
      setCorrectAnswers([]);
      setShowAnswers(false);
      setSelectedAnswers([]);
    }
  }, [currentIndex]);

  const loadLesson = async () => {
    try {
      if (!lessonNumber) return;

      const lesson = LessonList[lessonNumber as string];
      let allQuestions: Question[] = [];

      setLessonName(lesson.nazev);

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
    setShowAnswers(true);
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        style={{
          padding: 16,
          flex: 0,
          maxWidth: 600,
          height: "100%",
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
                alignItems: "center",
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
              <View>
                <ThemedText
                  style={{
                    opacity: 0.7,
                    marginBottom: 4,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {lessonName}
                </ThemedText>
                <ThemedText
                  style={{ opacity: 0.7, fontSize: 12, textAlign: "center" }}
                >
                  Otázka č.{(currentIndex as number) + 1}
                </ThemedText>
              </View>
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
                {"spr" in questions[currentIndex] ? (
                  <>
                    {Array.isArray(questions[currentIndex]["spr"]) ? (
                      <>
                        <View style={{ marginVertical: 24 }}>
                          <ThemedText style={{ fontSize: 32 }}>
                            {questions[currentIndex].ot}
                          </ThemedText>
                          <ThemedText
                            style={{
                              opacity: 0.7,
                              marginTop: 8,
                              fontSize: 16,
                              textAlign: "center",
                            }}
                          >
                            Vyberte {questions[currentIndex]["spr"].length}{" "}
                            {questions[currentIndex]["spr"].length === 1
                              ? "otázku"
                              : questions[currentIndex]["spr"].length <= 4
                                ? "otázky"
                                : "otázek"}
                          </ThemedText>
                        </View>
                        {["od1", "od2", "od3", "od4", "od5", "od6", "od7"]
                          .filter(
                            (value) =>
                              questions[currentIndex][value as keyof Question]
                          )
                          .map((value, index) => (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              key={index}
                              disabled={
                                ("spr" in questions[currentIndex] &&
                                  Array.isArray(
                                    questions[currentIndex]["spr"]
                                  ) &&
                                  !selectedAnswers.includes(index) &&
                                  questions[currentIndex]["spr"].length <=
                                    selectedAnswers.length) ||
                                hasAnswered
                              }
                              style={{
                                opacity:
                                  "spr" in questions[currentIndex] &&
                                  Array.isArray(
                                    questions[currentIndex]["spr"]
                                  ) &&
                                  !selectedAnswers.includes(index) &&
                                  questions[currentIndex]["spr"].length <=
                                    selectedAnswers.length
                                    ? 0.6
                                    : 1,
                                borderWidth: 2,
                                borderRadius: 14,
                                borderColor: selectedAnswers.includes(index)
                                  ? dark
                                    ? "#374b6c"
                                    : "#3ea2f4"
                                  : "transparent",
                                marginBottom: 8,
                              }}
                              onPress={() =>
                                "spr" in questions[currentIndex] &&
                                Array.isArray(questions[currentIndex]["spr"])
                                  ? toggleMultipleAnswers(
                                      index,
                                      questions[currentIndex]["spr"].length
                                    )
                                  : undefined
                              }
                            >
                              <View
                                style={{
                                  backgroundColor: !hasAnswered
                                    ? dark
                                      ? "#1e293b"
                                      : MD2Colors.blue100
                                    : "spr" in questions[currentIndex] &&
                                        questions[currentIndex]["spr"].includes(
                                          `od${index + 1}`
                                        )
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
                                <ThemedText
                                  style={{ fontSize: 24, marginRight: 12 }}
                                >
                                  {["A", "B", "C", "D", "E", "F", "G"][index]}
                                </ThemedText>
                                <ThemedText
                                  style={{
                                    fontSize: 14,
                                    flexShrink: 1,
                                    flex: 1,
                                  }}
                                >
                                  {
                                    questions[currentIndex][
                                      value as keyof Question
                                    ]
                                  }
                                </ThemedText>
                                {hasAnswered && (
                                  <>
                                    {"spr" in questions[currentIndex] &&
                                    questions[currentIndex]["spr"].includes(
                                      `od${index + 1}`
                                    ) ? (
                                      <Check
                                        color={
                                          dark
                                            ? MD2Colors.green200
                                            : MD2Colors.green800
                                        }
                                      />
                                    ) : (
                                      <X
                                        color={
                                          dark
                                            ? MD2Colors.red200
                                            : MD2Colors.red800
                                        }
                                      />
                                    )}
                                  </>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                        <Button
                          labelStyle={{ fontFamily: "Inter" }}
                          mode="contained"
                          disabled={
                            selectedAnswers.length !=
                            questions[currentIndex]["spr"].length
                          }
                          style={{
                            backgroundColor: "#155dfc",
                            opacity:
                              selectedAnswers.length !=
                              questions[currentIndex]["spr"].length
                                ? 0.5
                                : 1,
                            pointerEvents:
                              selectedAnswers.length !=
                              questions[currentIndex]["spr"].length
                                ? "none"
                                : "auto",
                            marginBottom: 12,
                          }}
                          textColor="white"
                          onPress={() => {
                            if (hasAnswered) {
                              handleContinue();
                            } else {
                              if (!("spr" in questions[currentIndex])) return;
                              const correctAnswers =
                                questions[currentIndex].spr;
                              const isCorrect =
                                Array.isArray(correctAnswers) &&
                                selectedAnswers.length ===
                                  correctAnswers.length &&
                                correctAnswers.every((ans) =>
                                  selectedAnswers.includes(
                                    typeof ans === "number"
                                      ? ans
                                      : [
                                          "od1",
                                          "od2",
                                          "od3",
                                          "od4",
                                          "od5",
                                          "od6",
                                          "od7",
                                        ].indexOf(ans)
                                  )
                                );
                              handleAnswer(isCorrect);
                            }
                          }}
                        >
                          {hasAnswered ? "Pokračovat" : "Zkontrolovat"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <ThemedText
                          style={{ fontSize: 32, marginVertical: 24 }}
                        >
                          {questions[currentIndex].ot}
                        </ThemedText>
                        {["od1", "od2", "od3", "od4", "od5", "od6", "od7"]
                          .filter(
                            (value) =>
                              questions[currentIndex][value as keyof Question]
                          )
                          .map((value, index) => (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              key={index}
                              style={{ marginBottom: 12 }}
                              onPress={() =>
                                handleAnswer(
                                  "spr" in questions[currentIndex] &&
                                    questions[currentIndex]["spr"] === value
                                )
                              }
                            >
                              <View
                                style={{
                                  backgroundColor: !hasAnswered
                                    ? dark
                                      ? "#1e293b"
                                      : MD2Colors.blue100
                                    : "spr" in questions[currentIndex] &&
                                        questions[currentIndex]["spr"] === value
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
                                <ThemedText
                                  style={{ fontSize: 24, marginRight: 12 }}
                                >
                                  {["A", "B", "C", "D", "E", "F", "G"][index]}
                                </ThemedText>
                                <ThemedText
                                  style={{
                                    fontSize: 14,
                                    flexShrink: 1,
                                    flex: 1,
                                  }}
                                >
                                  {
                                    questions[currentIndex][
                                      value as keyof Question
                                    ]
                                  }
                                </ThemedText>
                                {hasAnswered && (
                                  <>
                                    {"spr" in questions[currentIndex] &&
                                    questions[currentIndex]["spr"] === value ? (
                                      <Check
                                        color={
                                          dark
                                            ? MD2Colors.green200
                                            : MD2Colors.green800
                                        }
                                      />
                                    ) : (
                                      <X
                                        color={
                                          dark
                                            ? MD2Colors.red200
                                            : MD2Colors.red800
                                        }
                                      />
                                    )}
                                  </>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                        <Button
                          labelStyle={{ fontFamily: "Inter" }}
                          mode="contained"
                          style={{
                            backgroundColor: "#155dfc",
                            visibility: hasAnswered ? "visible" : "hidden",
                            pointerEvents: hasAnswered ? "auto" : "none",
                            opacity: hasAnswered ? 1 : 0,
                            marginBottom: 12,
                          }}
                          textColor="white"
                          onPress={() => handleContinue()}
                        >
                          Pokračovat
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {renderInputQuestion(questions[currentIndex as number].ot)}
                    <Button
                      labelStyle={{ fontFamily: "Inter" }}
                      mode="contained"
                      disabled={inputsEmpty}
                      style={{
                        backgroundColor: "#155dfc",
                        opacity: inputsEmpty ? 0.5 : 1,
                        pointerEvents: inputsEmpty ? "none" : "auto",
                        marginBottom: 12,
                      }}
                      textColor="white"
                      onPress={() => {
                        if (hasAnswered) handleContinue();
                        else handleAnswer(allCorrect);
                      }}
                    >
                      {hasAnswered ? "Pokračovat" : "Zkontrolovat"}
                    </Button>
                  </>
                )}

                {questions[currentIndex]["imgPath"] && (
                  <View style={{ flexDirection: "row", borderRadius: 12 }}>
                    <Image
                      style={{
                        width: "100%",
                        flex: 1,
                        aspectRatio: 1,
                      }}
                      resizeMode="contain"
                      alt="Obrázek"
                      source={{ uri: questions[currentIndex]["imgPath"] }}
                    />
                  </View>
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
    </ScrollView>
  );
};

export default LessonScreen;
