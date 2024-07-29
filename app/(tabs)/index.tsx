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
import { useAction, useMutation, useQueries, useQuery } from "convex/react";
import { Link, Redirect, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  useColorScheme,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Bookshelf from "@/components/Bookshelf";

export default function HomePage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const clerk = useClerk();
  const theme = useColorScheme() ?? "dark";

  const [text, setText] = useState("");
  const [shelf, setShelf] = useState("default");
  const [isbn, setIsbn] = useState<string>("");

  const fetchBooks = useAction(api.books.fetchBookInfoFromOpenLibaryWithISBN);
  const fetchBookshelf = useQuery(api.books.getListOfAllBookshelfs);

  const getBookFromAPI = async () => {
    // await fetchBooks({ isbn: isbn });

    router.navigate({ pathname: "/[book]", params: { isbn } });
  };

  let DATA: Array<string> = [];

  fetchBookshelf?.map((shelf) => DATA.push(shelf));

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
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Bookshelf bookshelf={item} />}
        />
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
