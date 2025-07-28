/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD2Colors } from "react-native-paper";

const tintColorLight = MD2Colors.blue600;
const tintColorDark = MD2Colors.blue600;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    border: "rgba(0, 0, 0, 0.1)",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#25232a",
    border: "rgba(255, 255, 255, 0.1)",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
