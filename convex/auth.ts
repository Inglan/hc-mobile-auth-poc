import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { genericOAuth } from "better-auth/plugins";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);
const siteUrl = process.env.SITE_URL!;

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,

    // My local ip because wildcard not working :)
    trustedOrigins: ["exp://192.168.178.68:8081"],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: false,
    },
    plugins: [
      // The Expo and Convex plugins are required
      expo(),
      convex(),
      genericOAuth({
        config: [
          {
            providerId: "hack-club",
            clientId: process.env.HACK_CLUB_CLIENT_ID!,
            clientSecret: process.env.HACK_CLUB_CLIENT_SECRET!,
            // discoveryUrl: "", // HC Account doesn't support discovery

            // URLs for auth
            authorizationUrl: "https://account.hackclub.com/oauth/authorize",
            tokenUrl: "https://account.hackclub.com/oauth/token",

            scopes: ["email", "name", "slack_id"],

            // Custom get user info function
            getUserInfo: async (tokens) => {
              const userInfo = await fetch(
                "https://account.hackclub.com/api/v1/me",
                {
                  headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                },
              ).then((res) => res.json());

              return {
                emailVerified: true,
                id: userInfo.identity.id,
                name: `${userInfo.identity.first_name} ${userInfo.identity.last_name}`,
                email: userInfo.identity.primary_email,
              };
            },
          },
        ],
      }),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});
