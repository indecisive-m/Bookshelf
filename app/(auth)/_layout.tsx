import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const theme = useColorScheme() ?? "dark";

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={25}
            onPress={() => router.back()}
            style={{ color: Colors[theme].tint }}
          />
        ),
      }}
    />
  );
}
