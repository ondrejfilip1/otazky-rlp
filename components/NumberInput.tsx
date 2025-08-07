import React, { useState } from "react";
import { MD2Colors, TextInput, useTheme } from "react-native-paper";
import ThemedText from "./ThemedText";
import { View } from "react-native";

const NumberInput = ({
  correct,
  onAnswer,
  onEmpty,
  showAnswer,
  isCorrect,
}: {
  correct: number;
  onAnswer: Function;
  onEmpty: Function;
  showAnswer?: boolean;
  isCorrect?: boolean;
}) => {
  const [value, setValue] = useState("");
  const { dark } = useTheme();

  const handleChange = (string: string) => {
    string = string.replace(/[^0-9]/g, "");
    setValue(string);
    onEmpty(string.length > 0);
    const parsed = parseInt(string, 10);
    if (!isNaN(parsed)) onAnswer(parsed === correct);
  };

  return (
    <View>
      <TextInput
        dense
        keyboardType="numeric"
        mode="outlined"
        label="Číslo"
        value={value}
        onChangeText={handleChange}
        maxLength={12}
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

export default NumberInput;
