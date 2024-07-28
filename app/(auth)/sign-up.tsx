import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useClerk, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { borderRadius, fontSize, spacing } from "@/constants/Styles";
import { ErrorObject } from "@/constants/types";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const theme = useColorScheme() ?? "dark";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState({
    firstName: "",
    secondName: "",
  });

  const clerk = useClerk();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: name.firstName,
        lastName: name.secondName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2));

      const error = err.errors;

      error.map((error: ErrorObject) => {
        if (error.code === "form_param_format_invalid") {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Email address invalid",
          });
        }
        if (error.code === "form_password_length_too_short") {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Password too short",
          });
        }
        if (error.code === "form_password_pwned") {
          Toast.show({
            type: "error",
            position: "top",
            text1:
              "Password has been found in an online data breach. Please use a different password",
          });
        }
        if (error.code === "form_identifier_exists") {
          Toast.show({
            type: "error",
            position: "top",
            text1: "That email address is in use. Would you like to log in?",
          });
        }
        if (error.code === "form_param_nil" && !emailAddress && !password) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Please enter an email address and password",
          });
        }
        if (error.code === "form_param_nil" && !emailAddress) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Please enter an email address",
          });
        }
        if (error.code === "form_param_nil" && !password) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Please enter a password",
          });
        }
      });
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
                {
                  borderColor: Colors[theme].tint,
                  color: Colors[theme].text,
                },
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
                {
                  borderColor: Colors[theme].tint,
                  color: Colors[theme].text,
                },
              ]}
            />
          </ThemedView>
          <ThemedView style={{ flexDirection: "row" }}>
            <ThemedView style={[styles.container, styles.halfScreenContainer]}>
              <ThemedText type="subtitle">
                First Name:
                <ThemedText style={styles.optionalText}>(optional)</ThemedText>
              </ThemedText>

              <TextInput
                value={name.firstName}
                placeholder="First name..."
                onChangeText={(e) => setName({ ...name, firstName: e })}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[theme].tint,
                    color: Colors[theme].text,
                  },
                ]}
              />
            </ThemedView>

            <ThemedView style={[styles.container, styles.halfScreenContainer]}>
              <ThemedText type="subtitle">
                Last Name:
                <ThemedText style={styles.optionalText}>(optional)</ThemedText>
              </ThemedText>

              <TextInput
                value={name.secondName}
                placeholder="Last name..."
                onChangeText={(e) => setName({ ...name, secondName: e })}
                style={[
                  styles.input,
                  {
                    borderColor: Colors[theme].tint,
                    color: Colors[theme].text,
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={[styles.container]}>
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
  halfScreenContainer: {
    width: "50%",
    columnGap: spacing.extraSmall,
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
  optionalText: {
    fontSize: fontSize.extraSmall,
  },
});
