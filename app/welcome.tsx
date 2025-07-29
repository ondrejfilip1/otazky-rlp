import LoadingScreen from "@/components/LoadingScreen";
import ThemedView from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { TextInput } from "react-native-paper";
export default function WelcomeScreen() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) router.replace("/");
  };

  const login = async () => {
    await AsyncStorage.setItem("username", username);
    router.replace("/");
  };

  return (
    <>
    {username !== "" ? (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 16,
        }}
      >
        <Text
          className="text-4xl"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          Vítejte
        </Text>
        <TextInput
          mode="outlined"
          style={{ width: "100%" }}
          label="Uživatelské jméno"
          value={username}
          onChangeText={(text: SetStateAction<string>) => setUsername(text)}
        />
        <Button mode="contained" disabled={!username} onPress={login}>
          Pokračovat
        </Button>
      </View>
    ) : (
      <LoadingScreen description="Načítání" />
    )}
      
    </>
  );
}
