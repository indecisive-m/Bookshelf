import { useAuth, useUser } from "@clerk/clerk-expo";
import { useConvexAuth } from "convex/react";
import { Stack, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Stack />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />

      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
