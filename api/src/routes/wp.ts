import { Hono } from "hono";
import { eq, and, gte, count } from "drizzle-orm";
import { verifyWithMira, type MiraVerifyRequest, type MiraVerifyResponse } from "../lib/mira";
import { sites, subscriptions, plans, verificationHistory, oauthCodes } from "../db/schema";
import { type AppEnv, requireSite } from "../types";

const app = new Hono<AppEnv>();

// ========== OAuth Flow for WordPress Plugin ==========

// Step 1: WordPress redirects user here to authorize
app.get("/oauth/authorize", async (c) => {
  const auth = c.get("auth");
  const db = c.get("db");

  const redirectUri = c.req.query("redirect_uri");
  const siteUrl = c.req.query("site_url");

  if (!redirectUri || !siteUrl) {
    return c.json({ error: "Missing redirect_uri or site_url" }, 400);
  }

  // Check if user is logged in
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    // Redirect to dashboard with return URL (use APP_URL for public URL)
    const returnPath = `/v1/wp/oauth/authorize?redirect_uri=${encodeURIComponent(redirectUri)}&site_url=${encodeURIComponent(siteUrl)}`;
    const returnUrl = encodeURIComponent(`${c.env.APP_URL}${returnPath}`);
    return c.redirect(`${c.env.APP_URL}/dashboard?return=${returnUrl}`);
  }

  // Check subscription
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .get();

  if (!subscription || subscription.status !== "active") {
    return c.redirect(`${c.env.APP_URL}/dashboard/billing?error=subscription_required`);
  }

  // Check site limit
  const plan = subscription.planId
    ? await db.select().from(plans).where(eq(plans.id, subscription.planId)).get()
    : null;

  if (plan && plan.siteLimit !== -1) {
    const existingSites = await db
      .select()
      .from(sites)
      .where(eq(sites.userId, session.user.id))
      .all();

    if (existingSites.length >= plan.siteLimit) {
      return c.redirect(`${c.env.APP_URL}/dashboard/sites?error=limit_reached`);
    }
  }

  // Generate authorization code
  const code = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(oauthCodes).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    code,
    redirectUri,
    siteUrl,
    expiresAt,
  });

  // Redirect back to WordPress with code
  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set("code", code);
  return c.redirect(redirectUrl.toString());
});

// Step 2: WordPress exchanges code for access token
app.post("/oauth/token", async (c) => {
  const db = c.get("db");

  const { code, redirect_uri } = await c.req.json<{
    code: string;
    redirect_uri: string;
  }>();

  // Find and validate code
  const oauthCode = await db
    .select()
    .from(oauthCodes)
    .where(eq(oauthCodes.code, code))
    .get();

  if (!oauthCode) {
    return c.json({ error: "invalid_grant", error_description: "Invalid code" }, 400);
  }

  if (oauthCode.redirectUri !== redirect_uri) {
    return c.json({ error: "invalid_grant", error_description: "Redirect URI mismatch" }, 400);
  }

  if (new Date() > oauthCode.expiresAt) {
    await db.delete(oauthCodes).where(eq(oauthCodes.id, oauthCode.id));
    return c.json({ error: "invalid_grant", error_description: "Code expired" }, 400);
  }

  // Generate access token
  const accessToken = `wpat_${crypto.randomUUID().replace(/-/g, "")}`;
  const refreshToken = `wprt_${crypto.randomUUID().replace(/-/g, "")}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Create site record
  const siteId = crypto.randomUUID();
  await db.insert(sites).values({
    id: siteId,
    userId: oauthCode.userId,
    domain: new URL(oauthCode.siteUrl).hostname,
    name: new URL(oauthCode.siteUrl).hostname,
    accessToken,
    refreshToken,
    tokenExpiresAt: expiresAt,
  });

  // Delete used code
  await db.delete(oauthCodes).where(eq(oauthCodes.id, oauthCode.id));

  return c.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: 30 * 24 * 60 * 60, // 30 days in seconds
    site_id: siteId,
  });
});

// Refresh access token
app.post("/oauth/refresh", async (c) => {
  const db = c.get("db");

  const { refresh_token } = await c.req.json<{ refresh_token: string }>();

  const site = await db
    .select()
    .from(sites)
    .where(eq(sites.refreshToken, refresh_token))
    .get();

  if (!site) {
    return c.json({ error: "invalid_grant", error_description: "Invalid refresh token" }, 400);
  }

  // Generate new tokens
  const accessToken = `wpat_${crypto.randomUUID().replace(/-/g, "")}`;
  const newRefreshToken = `wprt_${crypto.randomUUID().replace(/-/g, "")}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db
    .update(sites)
    .set({
      accessToken,
      refreshToken: newRefreshToken,
      tokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(sites.id, site.id));

  return c.json({
    access_token: accessToken,
    refresh_token: newRefreshToken,
    token_type: "Bearer",
    expires_in: 30 * 24 * 60 * 60,
  });
});

// Revoke token (disconnect site)
app.post("/oauth/revoke", async (c) => {
  const db = c.get("db");
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing token" }, 401);
  }

  const token = authHeader.slice(7);
  const site = await db.select().from(sites).where(eq(sites.accessToken, token)).get();

  if (site) {
    await db.delete(sites).where(eq(sites.id, site.id));
  }

  return c.json({ success: true });
});

// ========== WordPress Plugin API Endpoints ==========

// Middleware to validate site access token
app.use("/verify", async (c, next) => {
  const db = c.get("db");
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid token" }, 401);
  }

  const token = authHeader.slice(7);
  const site = await db.select().from(sites).where(eq(sites.accessToken, token)).get();

  if (!site) {
    return c.json({ error: "Invalid token" }, 401);
  }

  if (site.tokenExpiresAt && new Date() > site.tokenExpiresAt) {
    return c.json({ error: "Token expired", code: "TOKEN_EXPIRED" }, 401);
  }

  c.set("site", site);
  c.set("userId", site.userId);
  await next();
});

app.use("/status", async (c, next) => {
  const db = c.get("db");
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid token" }, 401);
  }

  const token = authHeader.slice(7);
  const site = await db.select().from(sites).where(eq(sites.accessToken, token)).get();

  if (!site) {
    return c.json({ error: "Invalid token" }, 401);
  }

  if (site.tokenExpiresAt && new Date() > site.tokenExpiresAt) {
    return c.json({ error: "Token expired", code: "TOKEN_EXPIRED" }, 401);
  }

  c.set("site", site);
  c.set("userId", site.userId);
  await next();
});

// Verify content from WordPress
app.post("/verify", async (c) => {
  const db = c.get("db");
  const site = requireSite(c);
  const userId = site.userId;

  const body = await c.req.json<{
    content: string;
    postId?: string;
    postTitle?: string;
  }>();

  // Check subscription and limits
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!subscription || subscription.status !== "active") {
    return c.json({ error: "Subscription inactive", code: "SUBSCRIPTION_REQUIRED" }, 403);
  }

  const plan = subscription.planId
    ? await db.select().from(plans).where(eq(plans.id, subscription.planId)).get()
    : null;

  if (!plan) {
    return c.json({ error: "No plan found" }, 403);
  }

  // Count verifications in current billing period
  const periodStart = subscription.currentPeriodStart || new Date(0);
  const usageCount = await db
    .select({ count: count() })
    .from(verificationHistory)
    .where(
      and(
        eq(verificationHistory.userId, userId),
        gte(verificationHistory.createdAt, periodStart)
      )
    )
    .get();

  const verificationsUsed = usageCount?.count || 0;
  if (verificationsUsed >= plan.monthlyLimit) {
    return c.json({
      error: "Monthly verification limit reached",
      code: "LIMIT_REACHED",
      used: verificationsUsed,
      limit: plan.monthlyLimit,
    }, 429);
  }

  // Create verification history record
  const historyId = crypto.randomUUID();
  await db.insert(verificationHistory).values({
    id: historyId,
    userId,
    siteId: site.id,
    postId: body.postId,
    postTitle: body.postTitle,
    content: body.content,
  });

  // Call Mira Verify API
  const miraRequest: MiraVerifyRequest = {
    fact: body.content,
    domain: "general",
    minRequired: 2,
  };

  const miraResponse = await verifyWithMira(c.env.MIRA_API_KEY, miraRequest);

  if (!miraResponse.ok) {
    console.error("Mira API error:", await miraResponse.text());
    return c.json({ error: "Verification service error" }, 502);
  }

  // Create a stream that parses the response and updates the history
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Write our custom event with historyId first
  writer.write(encoder.encode(`data: {"type":"init","data":{"historyId":"${historyId}"}}\n\n`));

  // Parse and forward the Mira response, updating history on completion
  (async () => {
    const reader = miraResponse.body?.getReader();
    if (!reader) {
      await writer.close();
      return;
    }

    let buffer = "";
    let finalResult: MiraVerifyResponse | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Forward the raw data immediately
        await writer.write(value);

        // Also parse it to capture the final result
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.type === "completed" && parsed.data) {
                finalResult = parsed.data;
              }
            } catch {
              // Not JSON or not final result
            }
          }
        }
      }

      // Update history with final result
      if (finalResult) {
        const overallStatus = finalResult.results.every(r => r.assessment === "TRUE")
          ? "TRUE"
          : finalResult.results.every(r => r.assessment === "FALSE")
            ? "FALSE"
            : finalResult.results.some(r => r.assessment === "NO CONSENSUS")
              ? "NO_CONSENSUS"
              : "MIXED";

        await db
          .update(verificationHistory)
          .set({
            result: JSON.stringify(finalResult),
            status: overallStatus,
            claimsCount: finalResult.results.length,
            tokensUsed: finalResult.tokenUsage.totalTokens,
          })
          .where(eq(verificationHistory.id, historyId));
      }
    } catch (err) {
      console.error("Stream processing error:", err);
    }

    await writer.close();
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});

// Get site status (for plugin settings page)
app.get("/status", async (c) => {
  const db = c.get("db");
  const site = requireSite(c);
  const userId = site.userId;

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  const plan = subscription?.planId
    ? await db.select().from(plans).where(eq(plans.id, subscription.planId)).get()
    : null;

  // Count actual verifications in current billing period
  let verificationsUsed = 0;
  if (subscription) {
    const periodStart = subscription.currentPeriodStart || new Date(0);
    const usageCount = await db
      .select({ count: count() })
      .from(verificationHistory)
      .where(
        and(
          eq(verificationHistory.userId, userId),
          gte(verificationHistory.createdAt, periodStart)
        )
      )
      .get();
    verificationsUsed = usageCount?.count || 0;
  }

  return c.json({
    connected: true,
    site: {
      id: site.id,
      domain: site.domain,
      showBadge: site.showBadge,
    },
    subscription: subscription
      ? {
          status: subscription.status,
          plan: plan?.name,
          verificationsUsed,
          verificationsLimit: plan?.monthlyLimit,
          periodEnd: subscription.currentPeriodEnd,
        }
      : null,
  });
});

export default app;
