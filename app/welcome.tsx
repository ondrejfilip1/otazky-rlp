import LoadingScreen from "@/components/LoadingScreen";
import ThemedText from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function WelcomeScreen() {
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) router.replace("/");
    else setLoaded(true);
  };

  const login = async () => {
    await AsyncStorage.setItem("username", username);
    router.replace("/");
  };

  return (
    <>
      {loaded ? (
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 16,
          }}
        >
          <ThemedText
            className="text-4xl"
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            Vítejte
          </ThemedText>
          <TextInput
            mode="outlined"
            style={{ width: "100%", fontFamily: "Inter" }}
            label="Uživatelské jméno"
            value={username}
            onChangeText={(text: SetStateAction<string>) => setUsername(text)}
          />
          <Button
            mode="contained"
            disabled={!username}
            labelStyle={{ fontFamily: "Inter" }}
            onPress={login}
          >
            Pokračovat
          </Button>
        </SafeAreaView>
      ) : (
        <LoadingScreen description="Načítání" />
      )}
    </>
  );
}
