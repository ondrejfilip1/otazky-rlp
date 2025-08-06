import React, { useState } from "react";
import { TextInput } from "react-native-paper";

const NumberInput = () => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      keyboardType="numeric"
      mode="outlined"
      label="Číslo"
      value={value}
      onChangeText={(string) => setValue(string.replace(/[^0-9]/g, ""))}
      maxLength={12}
    />
  );
};

export default NumberInput;
