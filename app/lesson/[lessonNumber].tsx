import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { Fragment, useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useLocalSearchParams } from "expo-router";
import lessonList from "@/utils/lessonMap";
import { Button, MD2Colors, MD3Colors, ProgressBar } from "react-native-paper";
import { Check, X } from "lucide-react-native";
import ThemedView from "@/components/ThemedView";
import ScoreCircle from "@/components/ui/ScoreCircle";

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
  const { lessonNumber } = useLocalSearchParams();
  const [numberArray, setNumberArray] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctlyAnswered, setCorrectlyAnswered] = useState(0);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    try {
      if (!lessonNumber) return;
      const lesson = await lessonList[lessonNumber as string];
      setQuestions(lesson.otazky);
      // array [0, 1, 2, ...]
      setNumberArray([...Array(lesson.otazky.length).keys()]);
      setTotalQuestions(lesson.otazky.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //console.log(numberArray);
    if (numberArray && numberArray.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * numberArray.length));
      setHasAnswered(false);
    }
  }, [numberArray]);

  const handleAnswer = (correct: boolean) => {
    setHasAnswered(true);
    if (correct && !hasAnswered) setCorrectlyAnswered((prev) => prev + 1);
  };

  const handleContinue = () => {
    if (currentIndex !== undefined)
      setNumberArray((prev) =>
        prev.filter((item, index) => index !== currentIndex)
      );
  };

  if (loading) return <LoadingScreen description="Načítání lekce" />;

  return (
    <ThemedView style={{ padding: 16, flex: 0 }}>
      {numberArray.length > 0 ? (
        <>
          <ProgressBar
            style={{ height: 6, marginBottom: 2 }}
            progress={(totalQuestions - numberArray.length) / totalQuestions}
            color={MD2Colors.blue600}
          />
          {typeof currentIndex === "number" && questions[currentIndex] && (
            <>
              <Text style={{ fontSize: 32, marginVertical: 24 }}>
                {questions[currentIndex].ot}
              </Text>

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
                        ? "#bfdbfe"
                        : questions[currentIndex]["spr"] === value
                          ? MD2Colors.green300
                          : MD2Colors.red300,
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                      {(index === 0 && "A") ||
                        (index === 1 && "B") ||
                        (index === 2 && "C")}
                    </Text>
                    <Text style={{ fontSize: 14, flexShrink: 1, flex: 1 }}>
                      {questions[currentIndex][value as keyof Question]}
                    </Text>
                    {hasAnswered && (
                      <>
                        {questions[currentIndex]["spr"] === value ? (
                          <Check color={MD2Colors.green800} />
                        ) : (
                          <X color={MD2Colors.red800} />
                        )}
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {hasAnswered && (
                <Button
                  mode="contained"
                  style={{ backgroundColor: "#155dfc" }}
                  textColor="white"
                  onPress={handleContinue}
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
          <Text style={{ fontSize: 30 }}>Skóre</Text>
          <ScoreCircle
            radius={100}
            strokeWidth={10}
            progress={correctlyAnswered / totalQuestions}
            color={MD2Colors.blue600}
          />
        </View>
      )}
    </ThemedView>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({});
