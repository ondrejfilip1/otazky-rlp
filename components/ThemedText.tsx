import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

type ThemedTextProps = TextProps & {
  children: React.ReactNode;
};

const ThemedText = ({ children, style, ...props }: ThemedTextProps) => {
  const { colors } = useTheme();

  return (
    <Text style={[styles.text, { color: colors.onBackground }, style]} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Inter",
  },
});
