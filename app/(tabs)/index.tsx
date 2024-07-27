import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import UserHeader from "@/components/UserHeader";
import Welcome from "@/components/Welcome";
import { spacing } from "@/constants/Styles";
import { api } from "@/convex/_generated/api";
import { BookObject } from "@/utils/types";
import {
  SignedIn,
  SignedOut,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-expo";
import { useAction } from "convex/react";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Button, TextInput, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomePage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const clerk = useClerk();

  const [text, setText] = useState("");
  const [shelf, setShelf] = useState("default");
  const [isbn, setIsbn] = useState("");

  const fetchBooks = useAction(api.books.fetchBookInfoFromOpenLibaryWithISBN);

  const onClick = async () => {
    const name: BookObject = await fetchBooks({ isbn: isbn });
  };

  return (
    <ThemedView style={[styles.container, { paddingVertical: insets.top }]}>
      <SignedIn>
        <UserHeader />
        <TextInput
          placeholder="Text"
          value={text}
          onChangeText={(e) => setText(e)}
          style={{
            width: "100%",
            padding: 10,
            borderColor: "black",
            borderWidth: 1,
          }}
        />
        <Button title="get books" onPress={onClick} />
      </SignedIn>
      <SignedOut>
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Welcome />
        </ThemedView>
      </SignedOut>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.small,
  },
});
