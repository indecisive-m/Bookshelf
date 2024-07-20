import { Redirect, Stack } from "expo-router";
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { useConvexAuth } from "convex/react";
import { ActivityIndicator } from "react-native";
import { Text } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack />;
}
