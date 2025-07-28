import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import React from "react";

type LoadingScreenProps = {
  description: string;
};

const LoadingScreen = (props: LoadingScreenProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{props.description}</Text>
      <ActivityIndicator animating={true} color={MD2Colors.blue600} size="large" />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
