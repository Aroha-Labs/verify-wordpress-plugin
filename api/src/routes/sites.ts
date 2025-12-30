import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { sites, subscriptions, plans } from "../db/schema";
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

// List connected sites
app.get("/", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);

  const userSites = await db
    .select({
      id: sites.id,
      domain: sites.domain,
      name: sites.name,
      showBadge: sites.showBadge,
      createdAt: sites.createdAt,
    })
    .from(sites)
    .where(eq(sites.userId, userId))
    .all();

  return c.json(userSites);
});

// Update site settings
app.patch("/:id", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const siteId = c.req.param("id");

  const body = await c.req.json<{ showBadge?: boolean; name?: string }>();

  const site = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .get();

  if (!site) {
    return c.json({ error: "Site not found" }, 404);
  }

  await db
    .update(sites)
    .set({
      showBadge: body.showBadge ?? site.showBadge,
      name: body.name ?? site.name,
      updatedAt: new Date(),
    })
    .where(eq(sites.id, siteId));

  return c.json({ success: true });
});

// Disconnect site
app.delete("/:id", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);
  const siteId = c.req.param("id");

  const site = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .get();

  if (!site) {
    return c.json({ error: "Site not found" }, 404);
  }

  await db.delete(sites).where(eq(sites.id, siteId));

  return c.json({ success: true });
});

// Check site limit
app.get("/can-add", async (c) => {
  const db = c.get("db");
  const userId = requireUserId(c);

  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .get();

  if (!subscription || subscription.status !== "active" || !subscription.planId) {
    return c.json({ canAdd: false, reason: "No active subscription" });
  }

  const plan = await db
    .select()
    .from(plans)
    .where(eq(plans.id, subscription.planId))
    .get();

  if (!plan) {
    return c.json({ canAdd: false, reason: "Plan not found" });
  }

  const siteCount = await db
    .select()
    .from(sites)
    .where(eq(sites.userId, userId))
    .all();

  // -1 means unlimited
  if (plan.siteLimit !== -1 && siteCount.length >= plan.siteLimit) {
    return c.json({ canAdd: false, reason: "Site limit reached", limit: plan.siteLimit });
  }

  return c.json({ canAdd: true });
});

export default app;
