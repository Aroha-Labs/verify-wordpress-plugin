import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { eq, and, desc, sql, gte, count } from "drizzle-orm";
import { verifyWithMira, type MiraVerifyRequest, type MiraVerifyResponse } from "../lib/mira";
import { subscriptions, plans, verificationHistory } from "../db/schema";
import { type AppEnv, requireUserId } from "../types";

const app = new Hono<AppEnv>();

// Auth middleware
app.use("*", async (c, next) => {
  const auth = c.get("auth");
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("userId", session.user.id);
  await next();
});

// Verify content - streams SSE response
app.post("/", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);

  const body = await c.req.json<{
    content: string;
    siteId?: string;
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
    return c.json({ error: "Active subscription required" }, 403);
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

  if ((usageCount?.count || 0) >= plan.monthlyLimit) {
    return c.json({ error: "Monthly verification limit reached" }, 429);
  }

  // Call Mira Verify API
  const miraRequest: MiraVerifyRequest = {
    fact: body.content,
    domain: "general",
    minRequired: 2,
  };

  const miraResponse = await verifyWithMira(c.env.MIRA_API_KEY, miraRequest);

  if (!miraResponse.ok) {
    const error = await miraResponse.text();
    console.error("Mira API error:", error);
    return c.json({ error: "Verification service error" }, 502);
  }

  // Create verification history record
  const historyId = crypto.randomUUID();
  await db.insert(verificationHistory).values({
    id: historyId,
    userId,
    siteId: body.siteId,
    postId: body.postId,
    postTitle: body.postTitle,
    content: body.content,
  });

  // Stream the response back to client
  return streamSSE(c, async (stream) => {
    const reader = miraResponse.body?.getReader();
    if (!reader) {
      await stream.writeSSE({ event: "error", data: JSON.stringify({ error: "No response body" }) });
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let finalResult: MiraVerifyResponse | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            const eventType = line.slice(7);
            await stream.writeSSE({ event: eventType, data: "" });
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            await stream.writeSSE({ data });

            // Parse completed event to save results
            try {
              const parsed = JSON.parse(data);
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
      console.error("Stream error:", err);
      await stream.writeSSE({ event: "error", data: JSON.stringify({ error: "Stream error" }) });
    }
  });
});

// Get verification history
app.get("/history", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const history = await db
    .select({
      id: verificationHistory.id,
      userId: verificationHistory.userId,
      siteId: verificationHistory.siteId,
      postId: verificationHistory.postId,
      postTitle: verificationHistory.postTitle,
      contentPreview: sql<string>`substr(${verificationHistory.content}, 1, 100)`,
      status: verificationHistory.status,
      claimsCount: verificationHistory.claimsCount,
      tokensUsed: verificationHistory.tokensUsed,
      createdAt: verificationHistory.createdAt,
    })
    .from(verificationHistory)
    .where(eq(verificationHistory.userId, userId))
    .orderBy(desc(verificationHistory.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  return c.json(history);
});

// Get single verification
app.get("/:id", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const id = c.req.param("id");

  const record = await db
    .select()
    .from(verificationHistory)
    .where(and(eq(verificationHistory.id, id), eq(verificationHistory.userId, userId)))
    .get();

  if (!record) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(record);
});

export default app;
