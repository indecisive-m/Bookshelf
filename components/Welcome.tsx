import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Link } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

const Welcome = () => {
  const theme = useColorScheme() ?? "dark";

  return (
    <ThemedView>
      <ThemedView
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 20,
        }}
      >
        <ThemedText type="title">Welcome To Your Bookshelf</ThemedText>
      </ThemedView>

      <ThemedView style={styles.center}>
        <ThemedText>Already Have An Account?</ThemedText>
        <Link
          href={"/sign-in"}
          style={[
            styles.button,
            { backgroundColor: Colors[theme].buttonAction },
          ]}
        >
          <ThemedText>Sign In</ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.center}>
        <ThemedText>New Here?</ThemedText>
        <Link
          href={"/sign-up"}
          style={[
            { backgroundColor: Colors[theme].buttonAction, borderRadius: 10 },
            styles.button,
            styles.center,
          ]}
        >
          <ThemedText>Create an Account</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 200,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
