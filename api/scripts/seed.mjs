#!/usr/bin/env node

import { spawnSync } from "child_process";

const DB_NAME = "verify-wordpress-plugin";

// Check if --remote flag is passed
const isRemote = process.argv.includes("--remote");

// Stripe Price ID for FactPress Weekly plan
const STRIPE_PRICE_ID = "price_1SqBSpBWnhNxYVZIiL0fdB7u";

const plans = [
  {
    id: "plan_weekly",
    name: "FactPress Weekly",
    stripePriceId: STRIPE_PRICE_ID,
    monthlyLimit: 100, // weekly limit (billing is weekly)
    siteLimit: 1,
    price: 1000, // $10 in cents
    features: [
      "100 verifications/week",
      "1 WordPress site",
      "Email support",
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

console.log(`Seeding database (${isRemote ? "REMOTE/PRODUCTION" : "LOCAL"})...\n`);

const locationFlag = isRemote ? "--remote" : "--local";

for (const plan of plans) {
  const featuresJSON = escapeSQL(JSON.stringify(plan.features));
  const sql = `INSERT OR REPLACE INTO plans (id, name, stripe_price_id, monthly_limit, site_limit, price, features, created_at) VALUES ('${plan.id}', '${plan.name}', '${plan.stripePriceId}', ${plan.monthlyLimit}, ${plan.siteLimit}, ${plan.price}, '${featuresJSON}', unixepoch());`;

  console.log(`Seeding plan: ${plan.name}`);
  wrangler("d1", "execute", DB_NAME, locationFlag, "--command", sql);
}

console.log("\nSeeding complete!");
console.log("\nVerifying plans:");
wrangler("d1", "execute", DB_NAME, locationFlag, "--command", "SELECT id, name, price FROM plans;");
