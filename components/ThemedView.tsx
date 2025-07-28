import { Text, View, ViewProps } from "react-native";
import React, { PropsWithChildren } from "react";

const ThemedView = ({ children, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props}>
      <Text style={{ fontFamily: "Inter" }}>{children}</Text>
    </View>
  );
};

export default ThemedView;