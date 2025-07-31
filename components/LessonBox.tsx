import { StyleSheet } from "react-native";
import React from "react";
import { Surface, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ThemedText from "./ThemedText";

type LessonBoxProps = {
  name: string;
  lessonID: string;
  questionCount: number;
};

const LessonBox = (props: LessonBoxProps) => {
  const router = useRouter();
  return (
    <Surface style={{ padding: 12, borderRadius: 12 }}>
      <ThemedText style={{ marginBottom: 6, fontSize: 16 }}>
        {props.name}
      </ThemedText>
      {props.questionCount > 0 && (
        <ThemedText style={{ marginBottom: 12, opacity: 0.6 }}>
          {props.questionCount}{" "}
          {props.questionCount === 1
            ? "otázka"
            : props.questionCount <= 4
              ? "otázky"
              : "otázek"}
        </ThemedText>
      )}
      <Button
        mode="contained"
        onPress={() => router.replace(`/lesson/${props.lessonID}`)}
        labelStyle={{fontFamily: "Inter"}}
      >
        Spustit lekci
      </Button>
    </Surface>
  );
};

export default LessonBox;

const styles = StyleSheet.create({});
