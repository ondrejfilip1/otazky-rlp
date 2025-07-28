import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import React from "react";

type LoadingScreenProps = {
  description: string;
};

const LoadingScreen = (props: LoadingScreenProps) => {
  return (
    <View>
      <Text>{props.description}</Text>
      <ActivityIndicator animating={true} color={MD2Colors.red800} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
