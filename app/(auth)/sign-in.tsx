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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, spacing } from "@/constants/Styles";
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
          position: "top",
          type: "error",
          text1: "Password incorrect",
        });
        setPassword("");
      }

      if (error === "form_identifier_not_found") {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Email not recognised",
          props: {
            backgroundColor: Colors[theme].text,
            textColor: Colors[theme].background,
          },
        });
      }

      if (error === "form_param_nil") {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a password",
          props: {
            backgroundColor: Colors[theme].text,
            textColor: Colors[theme].background,
          },
        });
      }

      if (error === "form_param_format_invalid") {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Please enter a valid email",
          props: {
            backgroundColor: Colors[theme].text,
            textColor: Colors[theme].background,
          },
        });
      }
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={-250}
    >
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
              {
                backgroundColor: Colors[theme].buttonAction,
              },
            ]}
          >
            <ThemedText
              type="subtitle"
              style={{ color: Colors[theme].buttonActionText }}
            >
              Log In
            </ThemedText>
          </Pressable>
        </ThemedView>
        <Pressable
          style={[styles.link, styles.container]}
          onPress={() => router.push("/sign-up")}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ color: Colors[theme].text, marginBottom: 5 }}
          >
            Don't have an account?
          </ThemedText>
          <ThemedText
            style={[
              styles.secondaryButton,
              { borderColor: Colors[theme].buttonAction },
            ]}
            type="defaultSemiBold"
          >
            Create Account
          </ThemedText>
        </Pressable>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    padding: spacing.small,
    gap: spacing.small,
  },
  button: {
    borderRadius: borderRadius.small,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.huge,
    width: "100%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.23,
    shadowRadius: 11.78,
    elevation: 15,
  },
  input: {
    padding: spacing.small,
    borderWidth: 1,
    fontSize: fontSize.small,
  },
  link: {
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    borderWidth: spacing.micro,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.tiny,
    borderRadius: borderRadius.small,
  },
});
