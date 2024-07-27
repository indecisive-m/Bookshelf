import { useAuth, useUser } from "@clerk/clerk-expo";
import { useConvexAuth } from "convex/react";
import { Stack, Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, spacing } from "@/constants/Styles";
import { ThemedView } from "@/components/ThemedView";
import TabBarIcon from "@/components/TabBarIcon";

export default function TabsLayout() {
  const { isSignedIn } = useAuth();
  const theme = useColorScheme() ?? "dark";

  if (!isSignedIn) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors[theme].background,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={"book"} />
            ),
            tabBarLabel: "Home",
            tabBarActiveTintColor: Colors[theme].text,
            tabBarLabelStyle: {
              fontSize: fontSize.extraSmall,
            },
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            headerShown: false,
            title: "Account",
            tabBarLabelStyle: {
              fontSize: fontSize.extraSmall,
            },
            tabBarActiveTintColor: Colors[theme].text,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={"person"} />
            ),
          }}
        />
        <Tabs.Screen name="[book]" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
