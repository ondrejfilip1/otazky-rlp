import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Button,
  Dialog,
  Divider,
  MD3Colors,
  Portal,
  useTheme,
} from "react-native-paper";
import ThemedText from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "lucide-react-native";
import { hardQuestionsEvent } from "@/utils/Events";

const Profile = () => {
  const [hardQuestions, setHardQuestions] = useState({});
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) setUsername(data);
    const hardQuestionsData = await AsyncStorage.getItem("hardQuestions");
    if (hardQuestionsData) setHardQuestions(JSON.parse(hardQuestionsData));
    else setHardQuestions([]);
  };

  const deleteHardQuestions = async () => {
    await AsyncStorage.removeItem("hardQuestions");
    setDialogVisible(false);
    hardQuestionsEvent.emit("update");
    const hardQuestionsData = await AsyncStorage.getItem("hardQuestions");
    if (hardQuestionsData) setHardQuestions(JSON.parse(hardQuestionsData));
    else setHardQuestions([]);
  };

  return (
    <SafeAreaView
      style={{
        padding: 16,
        backgroundColor: colors.background,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar.Icon size={156} icon={(props) => <User {...props} />} />
      <ThemedText style={{ fontSize: 32, marginVertical: 12 }}>
        {username}
      </ThemedText>
      <Divider style={{ marginVertical: 12 }} />
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={{
            maxWidth: 600,
            width: "100%",
            marginHorizontal: "auto",
          }}
        >
          <Dialog.Title style={{ fontFamily: "Inter" }}>
            Upozornění
          </Dialog.Title>
          <Dialog.Content>
            <ThemedText>
              Opravdu chcete vymazat všechny problémové otázky?
            </ThemedText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ fontFamily: "Inter" }}
              onPress={() => setDialogVisible(false)}
            >
              Zavřít
            </Button>
            <Button
              labelStyle={{ fontFamily: "Inter" }}
              onPress={deleteHardQuestions}
              mode="contained"
            >
              Vymazat
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {Object.keys(hardQuestions).length !== 0 && (
        <Button
          mode="contained"
          style={{ backgroundColor: MD3Colors.error50 }}
          onPress={() => setDialogVisible(true)}
          labelStyle={{ fontFamily: "Inter" }}
        >
          Vymazat problémové otázky
        </Button>
      )}
    </SafeAreaView>
  );
};

export default Profile;
