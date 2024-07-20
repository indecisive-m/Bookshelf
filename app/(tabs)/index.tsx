import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BookObject } from "@/utils/types";
import {
  SignedIn,
  SignedOut,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-expo";
import {
  Authenticated,
  Unauthenticated,
  useAction,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { Link, Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";

export default function HomePage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const clerk = useClerk();

  const [text, setText] = useState("");
  const [shelf, setShelf] = useState("default");
  const [isbn, setIsbn] = useState("");

  const fetchBooks = useAction(api.books.fetchBookInfoFromOpenLibaryWithISBN);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // if (!isSignedIn) {
  //   return <Redirect href={"/sign-in"} />;
  // }

  const signOut = () => {
    clerk.signOut();
    router.replace("/");
  };

  const deleteAccount = () => {
    user?.delete();
  };

  const onClick = async () => {
    const name: BookObject = await fetchBooks({ isbn: isbn });
  };

  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", padding: 20 }}
    >
      <SignedIn>
        <Text>{user?.emailAddresses[0].emailAddress}</Text>
        <Button title="Sign Out" onPress={signOut} />
        <Button title="Delete Account" onPress={deleteAccount} />
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
        <Link href={"/sign-in"}>
          <Text>Sign in</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
