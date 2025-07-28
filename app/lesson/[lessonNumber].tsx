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

  useEffect(() => {
    loadLesson();
    console.log(lessonNumber);
  }, []);

  const loadLesson = async () => {
    try {
      if (!lessonNumber) return;
      const lesson = await lessonList[lessonNumber as string];
      setQuestions(lesson.otazky);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen description="Načítání lekce" />;

  return (
    <View style={{ padding: 16 }}>
      {questions.map((value, index) => (
        <Fragment key={index}>
          <Text style={{ fontSize: 32, marginBottom: 24 }}>{value.ot}</Text>

          <TouchableOpacity style={{ marginBottom: 12 }} onPress={() => {}}>
            <View
              style={{
                backgroundColor: "#bfdbfe",
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>A</Text>
              <Text style={{ fontSize: 14, flexShrink: 1, flex: 1 }}>
                {value.od1}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 12 }} onPress={() => {}}>
            <View
              style={{
                backgroundColor: "#bfdbfe",
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>B</Text>
              <Text style={{ fontSize: 14, flexShrink: 1, flex: 1 }}>
                {value.od2}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginBottom: 12 }} onPress={() => {}}>
            <View
              style={{
                backgroundColor: "#bfdbfe",
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>C</Text>
              <Text style={{ fontSize: 14, flexShrink: 1, flex: 1 }}>
                {value.od3}
              </Text>
            </View>
          </TouchableOpacity>
        </Fragment>
      ))}
    </View>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({});
