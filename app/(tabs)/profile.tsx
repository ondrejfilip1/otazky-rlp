import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, useTheme } from "react-native-paper";
import ThemedText from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "lucide-react-native";

const Profile = () => {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await AsyncStorage.getItem("username");
    if (data) setUsername(data);
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
      <ThemedText style={{ fontSize: 32, marginTop: 12 }}>
        {username}
      </ThemedText>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
