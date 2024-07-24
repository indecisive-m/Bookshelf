import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const theme = useColorScheme() ?? "dark";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      const error = err;

      console.error(JSON.stringify(err, null, 2));
    }
  };

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
      {!pendingVerification && (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.container}>
            <ThemedText type="title">Email:</ThemedText>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
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
              onPress={onSignUpPress}
              style={[
                styles.button,
                { backgroundColor: Colors[theme].buttonAction },
              ]}
            >
              <ThemedText
                type="subtitle"
                style={{ color: Colors[theme].buttonActionText }}
              >
                Create Account
              </ThemedText>
            </Pressable>
          </ThemedView>
          <Pressable
            style={[styles.link, styles.container]}
            onPress={() => router.push("/sign-in")}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{ color: Colors[theme].text, marginBottom: 5 }}
            >
              Already have an account
            </ThemedText>
            <ThemedText
              style={[
                styles.secondaryButton,
                { borderColor: Colors[theme].buttonAction },
              ]}
              type="defaultSemiBold"
            >
              Log In
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </ThemedView>
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
