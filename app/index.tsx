import { authClient } from "@/lib/auth-client";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hack Club Auth Demo</Text>
      <AuthLoading>
        <Text>Loading...</Text>
      </AuthLoading>
      <Unauthenticated>
        <Text>Unauthenticated</Text>
        <Button
          title="Sign In"
          onPress={() => {
            authClient.signIn.oauth2({
              providerId: "hack-club",
              callbackURL: "/",
            });
          }}
        />
      </Unauthenticated>
      <Authenticated>
        <Text>Authenticated</Text>
      </Authenticated>
    </View>
  );
}
