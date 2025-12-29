import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { createDb } from "../db";
import * as schema from "../db/schema";

export function createAuth(db: D1Database, appUrl: string, accessCode?: string) {
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
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        accessCode: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!accessCode) return;
            const providedCode = (user as { accessCode?: string }).accessCode;
            if (providedCode !== accessCode) {
              throw new APIError("FORBIDDEN", {
                message: "Invalid access code",
              });
            }
            // Remove accessCode from user data before saving
            const { accessCode: _, ...userData } = user as { accessCode?: string } & typeof user;
            return { data: userData };
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
