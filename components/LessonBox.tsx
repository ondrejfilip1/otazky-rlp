import { StyleSheet } from "react-native";
import React from "react";
import { Surface, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ThemedText from "./ThemedText";

type LessonBoxProps = {
  name: string;
  lessonID: string;
};

const LessonBox = (props: LessonBoxProps) => {
  const router = useRouter();
  return (
    <Surface style={{ padding: 12, borderRadius: 12 }}>
      <ThemedText style={{ marginBottom: 12, fontSize: 16}}>{props.name}</ThemedText>
      <Button
        mode="contained"
        onPress={() => router.replace(`/lesson/${props.lessonID}`)}
      >
        Spustit lekci
      </Button>
    </Surface>
  );
};

export default LessonBox;

const styles = StyleSheet.create({});
