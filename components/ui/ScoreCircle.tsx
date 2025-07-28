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

const ScoreCircle: React.FC<ScoreCircleProps> = ({
  radius,
  strokeWidth,
  progress,
  color,
}) => {
  const [circumference, setCircumference] = useState(0);

  useEffect(() => {
    const circumferenceValue = 2 * Math.PI * radius;
    setCircumference(circumferenceValue);
  }, [radius]);

  const strokeDashoffset = circumference * (1 - progress);
  const progressValue = Math.round(progress * 100);

  return (
    <View style={{ aspectRatio: 1, width: radius * 2 }}>
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
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={radius / 2.5}
          fill={color}
          fontWeight="bold"
        >
          {progressValue}%
        </SvgText>
      </Svg>
    </View>
  );
};

export default ScoreCircle;
