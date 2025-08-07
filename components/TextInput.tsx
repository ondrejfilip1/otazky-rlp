import React, { useState } from "react";
import { MD2Colors, TextInput, useTheme } from "react-native-paper";
import ThemedText from "./ThemedText";
import { View } from "react-native";

const TextInputQuestion = ({
  correct,
  onAnswer,
  onEmpty,
  showAnswer,
  isCorrect,
}: {
  correct: string;
  onAnswer: Function;
  onEmpty: Function;
  showAnswer?: boolean;
  isCorrect?: boolean;
}) => {
  const [value, setValue] = useState("");
  const { dark } = useTheme();

  const handleChange = (string: string) => {
    setValue(string);
    onEmpty(string.trim().length > 0);
    onAnswer(string.trim().toLowerCase() === correct.trim().toLowerCase());
  };

  return (
    <View>
      <TextInput
        dense
        mode="outlined"
        label="Text"
        value={value}
        onChangeText={handleChange}
        maxLength={8}
        outlineStyle={{
          borderColor: showAnswer
            ? isCorrect
              ? dark
                ? MD2Colors.green700
                : MD2Colors.green300
              : dark
                ? MD2Colors.red700
                : MD2Colors.red300
            : undefined,
        }}
        editable={!showAnswer}
      />
      {showAnswer && !isCorrect && (
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 14,
            marginTop: 4,
            opacity: 0.7,
          }}
        >
          Správně: {correct}
        </ThemedText>
      )}
    </View>
  );
};

export default TextInputQuestion;
