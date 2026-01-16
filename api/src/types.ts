import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import type { Database } from "./db";
import type { Auth } from "./lib/auth";
import type { Site } from "./db/schema";

// Extend global Env with secrets (set via wrangler secret put)
declare global {
  interface Env {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    MIRA_API_KEY: string;
    BETTER_AUTH_SECRET: string;
    APP_VERSION?: string;
    GROO_PLUGIN_TOKEN?: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}

// Hono context variables
export type Variables = {
  db: Database;
  auth: Auth;
  userId?: string;
  site?: Site;
};

// App type for Hono
export type AppEnv = {
  Bindings: Env;
  Variables: Variables;
};

// Helper to safely get userId - throws 401 if not authenticated
export function requireUserId(c: Context<AppEnv>): string {
  const userId = c.get("userId");
  if (!userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return userId;
}

// Helper to safely get site - throws 401 if not authenticated
export function requireSite(c: Context<AppEnv>): Site {
  const site = c.get("site");
  if (!site) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return site;
}
