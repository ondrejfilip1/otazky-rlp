import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors, useTheme } from "react-native-paper";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedText from "./ThemedText";

type LoadingScreenProps = {
  description: string;
};

const LoadingScreen = (props: LoadingScreenProps) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: colors.background,
      }}
    >
      <ThemedText style={{ fontSize: 20, marginBottom: 12 }}>
        {props.description}
      </ThemedText>
      <ActivityIndicator
        animating={true}
        color={MD2Colors.blue600}
        size="large"
      />
    </SafeAreaView>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
