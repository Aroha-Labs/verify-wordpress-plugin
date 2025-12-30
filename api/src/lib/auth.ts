import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { createDb } from "../db";
import * as schema from "../db/schema";

const ALLOWED_DOMAINS = ["arohalabs.com", "mira.network"];

type AuthConfig = {
  db: D1Database;
  appUrl: string;
  accessCode?: string;
  googleClientId?: string;
  googleClientSecret?: string;
};

export function createAuth(config: AuthConfig) {
  const { db, appUrl, accessCode, googleClientId, googleClientSecret } = config;
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
    socialProviders: googleClientId && googleClientSecret ? {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    } : undefined,
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // Access code validation for email signup
        if (ctx.path === "/sign-up/email" && accessCode) {
          const body = ctx.body as { accessCode?: string } | undefined;
          if (body?.accessCode !== accessCode) {
            throw new APIError("FORBIDDEN", {
              message: "Invalid access code",
            });
          }
          const { accessCode: _, ...cleanBody } = body;
          return { context: { ...ctx, body: cleanBody } };
        }

        // Domain restriction for Google OAuth
        if (ctx.path === "/callback/google") {
          const url = new URL(ctx.request?.url || "");
          const error = url.searchParams.get("error");
          if (error) return; // Let better-auth handle OAuth errors
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        // Check domain after Google OAuth creates/finds user
        if (ctx.path === "/callback/google" && ctx.context?.newUser) {
          const user = ctx.context.newUser as { email?: string };
          const email = user.email?.toLowerCase() || "";
          const domain = email.split("@")[1];

          if (!ALLOWED_DOMAINS.includes(domain)) {
            throw new APIError("FORBIDDEN", {
              message: "Google sign-in is only available for internal users",
            });
          }
        }
      }),
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
