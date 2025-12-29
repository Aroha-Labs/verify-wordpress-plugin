import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
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
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;
        if (!accessCode) return;

        const body = ctx.body as { accessCode?: string } | undefined;
        if (body?.accessCode !== accessCode) {
          throw new APIError("FORBIDDEN", {
            message: "Invalid access code",
          });
        }

        // Remove accessCode from body before better-auth processes it
        const { accessCode: _, ...cleanBody } = body;
        return {
          context: {
            ...ctx,
            body: cleanBody,
          },
        };
      }),
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
