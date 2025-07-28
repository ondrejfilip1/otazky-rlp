import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Surface, Button } from 'react-native-paper'
import { Link, useRouter } from 'expo-router';

type LessonBoxProps = {
    name: string;
    lessonID: string;
}

const LessonBox = (props: LessonBoxProps) => {
    const router = useRouter();
  return (
    <Surface style={{padding: 8}}>
      <Text>{props.name}</Text>

      <Button onPress={() => router.replace(`/lesson/${props.lessonID}`)}>Spustit lekci</Button>
    </Surface>
  )
}

export default LessonBox

const styles = StyleSheet.create({})