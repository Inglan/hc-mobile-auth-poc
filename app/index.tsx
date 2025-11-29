import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { Button, Text, View } from "react-native";

export default function Index() {
  const user = useQuery(api.auth.getCurrentUser);

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
        <Text>Authenticated as {user && `${user.name} (${user.email})`}</Text>
        <Button
          title="Sign Out"
          onPress={() => {
            authClient.signOut();
          }}
        />
      </Authenticated>
    </View>
  );
}
