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
import { useAction, useMutation } from "convex/react";
import { Link, Redirect, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, TextInput, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function HomePage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const clerk = useClerk();
  const theme = useColorScheme() ?? "dark";

  const [text, setText] = useState("");
  const [shelf, setShelf] = useState("default");
  const [isbn, setIsbn] = useState("");

  const fetchBooks = useAction(api.books.fetchBookInfoFromOpenLibaryWithISBN);
  const addBooks = useMutation(api.books.addBookIntoDB);

  const getBookFromAPI = async () => {
    try {
      const getBookFromAPI: BookObject = await fetchBooks({ isbn: isbn });

      const bookResult = await getBookFromAPI.docs[0];

      const authorsNames = await bookResult.author_name;
      const firstPublishYear = await bookResult.first_publish_year;
      const bookTitle = await bookResult.title;
      const averageRating = await bookResult.ratings_average;
      const firstSentence = await bookResult.first_sentence[0];
      const coverImage = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

      router.navigate({
        pathname: "/[book]",
        params: {
          isbn,
          authorsNames,
          firstPublishYear,
          bookTitle,
          averageRating,
          firstSentence,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addBook = async () => {
    addBooks({ isbn: "1000" });
  };

  return (
    <ThemedView style={[styles.container, { paddingVertical: insets.top }]}>
      <SignedIn>
        <UserHeader />
        <TextInput
          placeholder="Text"
          value={isbn}
          onChangeText={(e) => setIsbn(e)}
          style={{
            width: "100%",
            padding: 10,
            borderColor: "black",
            borderWidth: 1,
          }}
        />
        <Button title="get books" onPress={getBookFromAPI} />
        <Button title="Add" onPress={addBook} />
        <Link href={{ pathname: "/[book]", params: { isbn: isbn } }}>
          <ThemedText>Fetch</ThemedText>
        </Link>
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
