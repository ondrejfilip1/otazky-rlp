// credit: https://stackoverflow.com/questions/78750180/how-do-i-create-a-circular-progress-bar-in-expo-react-native-with-a-text-in-cent

import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

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
  }, [radius]);

  const strokeDashoffset = circumference * (1 - progress);
  const progressValue = Math.round(progress * 100);

  // centering stuff
  const fontSize = radius / 2.5;
  const yOffset = fontSize * 0.3;

  return (
    <View style={[{ aspectRatio: 1, width: radius * 2 }, style]}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          stroke="rgba(0, 0, 0, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        <Circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        <SvgText
          x={radius - fontSize * 0.15}
          y={radius + yOffset}
          textAnchor="middle"
          fontSize={fontSize}
          fill={color}
          fontWeight="bold"
        >
          {progressValue}
        </SvgText>
        <SvgText
          x={radius + fontSize * 0.15}
          y={radius + yOffset}
          textAnchor="start"
          fontSize={fontSize}
          fill={color}
          fontWeight="bold"
        >
          %
        </SvgText>
      </Svg>
    </View>
  );
};

export default ScoreCircle;
