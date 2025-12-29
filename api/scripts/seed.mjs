#!/usr/bin/env node

import { spawnSync } from "child_process";

const DB_NAME = "mira-verify-db";

const plans = [
  {
    id: "plan_starter",
    name: "Starter",
    stripePriceId: "price_1ShoRWBWnhNxYVZIULT3fiww",
    monthlyLimit: 100,
    siteLimit: 1,
    price: 1900,
    features: [
      "100 verifications/month",
      "1 WordPress site",
      "Email support",
    ],
  },
  {
    id: "plan_pro",
    name: "Pro",
    stripePriceId: "price_1ShoSbBWnhNxYVZIiBh24UyM",
    monthlyLimit: 500,
    siteLimit: 5,
    price: 4900,
    features: [
      "500 verifications/month",
      "5 WordPress sites",
      "Priority support",
      "API access",
    ],
  },
  {
    id: "plan_business",
    name: "Business",
    stripePriceId: "price_1ShoSxBWnhNxYVZICr7FvJch",
    monthlyLimit: 2000,
    siteLimit: -1,
    price: 14900,
    features: [
      "2000 verifications/month",
      "Unlimited sites",
      "Dedicated support",
      "API access",
    ],
  },
];

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

function wrangler(...args) {
  const result = spawnSync("npx", ["wrangler", ...args], {
    stdio: "inherit",
    encoding: "utf-8",
  });
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

console.log("Seeding database...\n");

for (const plan of plans) {
  const featuresJSON = escapeSQL(JSON.stringify(plan.features));
  const sql = `INSERT OR REPLACE INTO plans (id, name, stripe_price_id, monthly_limit, site_limit, price, features, created_at) VALUES ('${plan.id}', '${plan.name}', '${plan.stripePriceId}', ${plan.monthlyLimit}, ${plan.siteLimit}, ${plan.price}, '${featuresJSON}', unixepoch());`;

  console.log(`Seeding plan: ${plan.name}`);
  wrangler("d1", "execute", DB_NAME, "--local", "--command", sql);
}

console.log("\nSeeding complete!");
console.log("\nVerifying plans:");
wrangler("d1", "execute", DB_NAME, "--local", "--command", "SELECT id, name, price FROM plans;");
