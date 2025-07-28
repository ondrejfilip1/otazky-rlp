import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import lessonList from "@/utils/lessonMap";
import LessonBox from "@/components/LessonBox";

const HomeScreen = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) setUsername(data);
  };

  return (
    <View>
      <Text>HomeScreen</Text>
      {Object.entries(lessonList).map(([lessonID, value]) => (
        <LessonBox name={value.nazev} lessonID={lessonID} key={lessonID} />
      ))}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
