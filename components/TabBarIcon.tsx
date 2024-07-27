import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { borderRadius, spacing } from "@/constants/Styles";

type Props = {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
};

const TabBarIcon = ({ focused, name }: Props) => {
  const theme = useColorScheme() ?? "dark";

  return (
    <ThemedView style={{ position: "relative" }}>
      <ThemedView
        style={
          focused
            ? {
                backgroundColor: Colors[theme].buttonAction,
                borderRadius: borderRadius.circle,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: spacing.small,
              }
            : null
        }
      >
        <Ionicons
          name={name}
          size={30}
          color={focused ? Colors[theme].buttonActionText : Colors[theme].icon}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default TabBarIcon;

const styles = StyleSheet.create({
  icon: {},
});
