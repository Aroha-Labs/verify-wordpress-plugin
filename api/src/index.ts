import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./lib/auth";
import { createDb } from "./db";
import type { AppEnv } from "./types";

import subscriptionsRoute from "./routes/subscriptions";
import webhooksRoute from "./routes/webhooks";
import verifyRoute from "./routes/verify";
import sitesRoute from "./routes/sites";
import wpRoute from "./routes/wp";

const app = new Hono<AppEnv>();

// Initialize db and auth on each request
app.use("*", async (c, next) => {
  c.set("db", createDb(c.env.DB));
  c.set("auth", createAuth(c.env.DB, c.env.APP_URL, c.env.ACCESS_CODE));
  await next();
});

// CORS for WordPress plugin requests (cross-origin from WP admin)
app.use("/v1/wp/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Better Auth handler
app.on(["POST", "GET"], "/v1/auth/*", (c) => {
  const auth = c.get("auth");
  return auth.handler(c.req.raw);
});

// Health check
app.get("/v1/health", (c) => {
  return c.json({
    status: "ok",
    version: c.env.APP_VERSION || "dev",
    timestamp: new Date().toISOString(),
  });
});

// Download plugin - redirects to latest GitHub release
app.get("/v1/download/plugin", async (c) => {
  const grooToken = c.env.GROO_PLUGIN_TOKEN;
  if (!grooToken) {
    return c.json({ error: "Plugin download not configured" }, 503);
  }

  const response = await fetch(
    "https://ops.groo.dev/v1/webhook/version?environment=production",
    { headers: { Authorization: `Bearer ${grooToken}` } }
  );

  if (!response.ok) {
    return c.json({ error: "Failed to fetch version" }, 502);
  }

  const data = await response.json() as { gitTag: string };
  if (!data.gitTag) {
    return c.json({ error: "No release found" }, 404);
  }

  return c.redirect(
    `https://github.com/Aroha-Labs/verify-wordpress-plugin/releases/download/${data.gitTag}/mira-verify.zip`
  );
});

// API routes
app.route("/v1/subscriptions", subscriptionsRoute);
app.route("/v1/verify", verifyRoute);
app.route("/v1/sites", sitesRoute);
app.route("/v1/wp", wpRoute);
app.route("/v1/webhooks", webhooksRoute);

export default app;
