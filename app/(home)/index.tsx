import { api } from "@/convex/_generated/api";
import { useClerk, useUser } from "@clerk/clerk-expo";
import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function HomePage() {
  const [text, setText] = useState("");
  const { user } = useUser();

  const createTask = useMutation(api.tasks.submitTask);
  const getTasks = useQuery(api.tasks.get);

  const router = useRouter();

  const clerk = useClerk();

  const signOut = () => {
    clerk.signOut();
    // router.replace("/sign-in");
  };

  const deleteAccount = () => {
    user?.delete();
  };

  const onSubmit = () => {
    createTask({ task: text });
    setText("");
  };

  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", padding: 20 }}
    >
      <Authenticated>
        <Text>{user?.emailAddresses[0].emailAddress}</Text>
        <Button title="Sign Out" onPress={signOut} />
        <Button title="Delete" onPress={deleteAccount} />
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
        <Button title="Submit" onPress={() => onSubmit()} />

        {getTasks?.map((task) => {
          return <Text>{task.task}</Text>;
        })}
      </Authenticated>
      <Unauthenticated>
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </Unauthenticated>
    </View>
  );
}
