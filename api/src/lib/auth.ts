import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "../db";
import * as schema from "../db/schema";

type AuthConfig = {
  db: D1Database;
  appUrl: string;
  googleClientId: string;
  googleClientSecret: string;
};

export function createAuth(config: AuthConfig) {
  const { db, appUrl, googleClientId, googleClientSecret } = config;
  const drizzle = createDb(db);

  return betterAuth({
    database: drizzleAdapter(drizzle, {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    baseURL: appUrl,
    basePath: "/v1/auth",
    trustedOrigins: [appUrl],
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
