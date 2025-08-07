// credit: https://stackoverflow.com/questions/78750180/how-do-i-create-a-circular-progress-bar-in-expo-react-native-with-a-text-in-cent
// TODO: Test text rendering on different OSs

import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import ThemedText from "../ThemedText";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";

interface ScoreCircleProps {
  radius: number;
  strokeWidth: number;
  progress: number;
  color: string;
}

const ScoreCircle: React.FC<ScoreCircleProps & { style?: any }> = ({
  radius,
  strokeWidth,
  progress,
  color,
  style,
}) => {
  const [circumference, setCircumference] = useState(0);

  useEffect(() => {
    const circumferenceValue = 2 * Math.PI * radius;
    setCircumference(circumferenceValue);
    theta.value = animateTo.value;
  }, [radius]);

  const strokeDashoffset = circumference * (1 - progress);
  const progressValue = Math.round(progress * 100);

  // centering stuff
  const fontSize = radius / 2.5;
  const { colors } = useTheme();

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const invertedCompletion = (100 - progressValue) / 100;
  const theta = useSharedValue(2 * Math.PI);
  const animateTo = useDerivedValue(() => 2 * Math.PI * invertedCompletion);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(theta.value * radius, {
        duration: 750,
      }),
    };
  });

  return (
    <View
      style={[
        { aspectRatio: 1, width: radius * 2, position: "relative" },
        style,
      ]}
    >
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          stroke="rgba(0, 0, 0, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        {Platform.OS === "android" || "ios" ? (
          <ThemedText
            style={{
              fontSize: fontSize,
              textAlign: "center",
              color: color,
              transform: "translateY(75%)",
            }}
          >
            {progressValue}%
          </ThemedText>
        ) : (
          <SvgText
            x="50%"
            y="50%"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={fontSize}
            fontFamily="Inter"
            fill={colors.onBackground}
          >
            {progressValue}%
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

export default ScoreCircle;
