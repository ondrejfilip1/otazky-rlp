import React, { useState } from "react";
import { TextInput } from "react-native-paper";

const TextInputQuestion = () => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      mode="outlined"
      label="Text"
      value={value}
      onChangeText={setValue}
      maxLength={8}
    />
  );
};

export default TextInputQuestion;
