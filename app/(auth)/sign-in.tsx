import {
  useAuth,
  useSignIn,
  useUser,
  isClerkAPIResponseError,
} from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import Toast from "react-native-toast-message";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const theme = useColorScheme() ?? "dark";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        return;
      }
    } catch (err: any) {
      const error = err.errors[0].code;

      if (error === "form_password_incorrect") {
        Toast.show({
          type: "error",
          text1: "Password Incorrect",
        });
        setPassword("");
      }

      if (error === "form_identifier_not_found") {
        Toast.show({
          type: "error",
          text1: "Email not recognised",
        });
      }

      if (error === "form_param_nil") {
        Toast.show({
          type: "error",
          text1: "Please enter a password",
        });
      }

      if (error === "form_param_format_invalid") {
        Toast.show({
          type: "error",
          text1: "Please enter a valid email",
        });
      }
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <ThemedView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 20,
        gap: 10,
      }}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Email:</ThemedText>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          secureTextEntry={false}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          style={[
            styles.input,
            { borderColor: Colors[theme].tint, color: Colors[theme].text },
          ]}
        />
      </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Password:</ThemedText>

        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={[
            styles.input,
            { borderColor: Colors[theme].tint, color: Colors[theme].text },
          ]}
        />
      </ThemedView>
      <ThemedView style={styles.container}>
        <Pressable
          onPress={onSignInPress}
          style={[
            styles.button,
            { backgroundColor: Colors[theme].buttonAction },
          ]}
        >
          <ThemedText type="subtitle">Sign In</ThemedText>
        </Pressable>
      </ThemedView>

      {/* <ThemedView style={styles.container}> */}
      <Pressable
        style={[styles.link, styles.container]}
        onPress={() => router.push("/sign-up")}
      >
        <ThemedText type="defaultSemiBold">Don't have an account?</ThemedText>
        <ThemedText
          style={[
            styles.secondaryButton,
            { borderColor: Colors[theme].buttonAction },
          ]}
          type="defaultSemiBold"
        >
          Sign up
        </ThemedText>
      </Pressable>
    </ThemedView>
    // </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 50,
    width: "100%",
    alignItems: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  link: {
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
