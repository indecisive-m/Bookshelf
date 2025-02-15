import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { borderRadius, spacing } from "@/constants/Styles";
import { useRouter } from "expo-router";

const UserHeader = () => {
  const { user } = useUser();
  const router = useRouter();

  const navigateToAccount = () => {
    router.navigate("/account");
  };

  const welcomeText = user?.firstName ? `Hello ${user?.firstName}!` : "Hello!";

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={navigateToAccount}>
        <Image source={{ uri: user?.imageUrl }} style={styles.image} />
      </Pressable>
      <ThemedText type="subtitle">{welcomeText}</ThemedText>
    </ThemedView>
  );
};

export default UserHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.small,
    paddingVertical: spacing.small,
  },

  image: {
    height: 40,
    width: 40,
    borderRadius: borderRadius.circle,
  },
});
