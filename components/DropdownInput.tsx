import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import ThemedText from "./ThemedText";
import { MD2Colors, useTheme } from "react-native-paper";

interface DropdownInputProps {
  correct: string;
  options: string[];
  onAnswer: (isCorrect: boolean) => void;
  onEmpty: (empty: boolean) => void;
  showAnswer?: boolean;
  isCorrect?: boolean;
}

const DropdownInput = ({
  correct,
  options,
  onAnswer,
  onEmpty,
  showAnswer,
  isCorrect,
}: DropdownInputProps) => {
  const { colors, dark } = useTheme();

  const data: ISelectItem<string>[] = options.map((o) => ({
    label: o,
    value: o,
  }));

  const [selected, setSelected] = useState<ISelectItem<string> | null>(null);

  const handleChange = (item: ISelectItem<string> | null) => {
    setSelected(item);
    if (item === null) {
      onEmpty(false);
    } else {
      onEmpty(true);
      const answerCorrect =
        item.value.trim().toLowerCase() === correct.trim().toLowerCase();
      onAnswer(answerCorrect);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Select
        data={data}
        value={selected}
        onChange={handleChange}
        selectedItemBackgroundColor={colors.surfaceVariant}
        selectedItemLabelColor={colors.onSurfaceVariant}
        arrowColor={colors.outline}
        labelStyle={{
          color: colors.onBackground,
        }}
        inputContainerStyle={{
          backgroundColor: "transparent",
          borderColor: showAnswer
            ? isCorrect
              ? dark
                ? MD2Colors.green700
                : MD2Colors.green300
              : dark
                ? MD2Colors.red700
                : MD2Colors.red300
            : colors.outline,
        }}
        containerStyle={{
          minWidth: 200,
          pointerEvents: showAnswer ? "none" : "auto",
        }}
        placeholderStyle={{
          fontSize: 16,
          color: colors.onBackground,
        }}
        itemLabelStyle={{
          fontSize: 16,
        }}
        checkColor={colors.onSurfaceVariant}
        dropdownItemStyle={{
          borderColor: colors.outline,
          display: showAnswer ? "none" : "flex",
        }}
        itemLabelColor={colors.onBackground}
        itemBackgroundColor={colors.background}
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
    </GestureHandlerRootView>
  );
};

export default DropdownInput;
