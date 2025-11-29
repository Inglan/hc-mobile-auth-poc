import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
  {
    // Optionally pause queries until the user is authenticated
    expectAuth: true,
    unsavedChangesWarning: false,
  },
);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>{" "}
    </ConvexBetterAuthProvider>
  );
}
