import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { spacing } from "@/constants/Styles";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Account() {
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();

  const logOutPress = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <ThemedView style={[styles.container, { paddingVertical: insets.top }]}>
      <ThemedText>Account page</ThemedText>
      <Pressable onPress={logOutPress}>
        <ThemedText>Log out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.small,
  },
});
