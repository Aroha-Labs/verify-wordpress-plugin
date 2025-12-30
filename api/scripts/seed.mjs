#!/usr/bin/env node

import { spawnSync } from "child_process";

const DB_NAME = "verify-wordpress-plugin";

// Check if --remote flag is passed
const isRemote = process.argv.includes("--remote");

// Production Stripe Price IDs (same Stripe account as dev)
const PROD_PRICE_IDS = {
  starter: "price_1ShoRWBWnhNxYVZIULT3fiww",
  pro: "price_1ShoSbBWnhNxYVZIiBh24UyM",
  business: "price_1ShoSxBWnhNxYVZICr7FvJch",
};

// Dev Stripe Price IDs
const DEV_PRICE_IDS = {
  starter: "price_1ShoRWBWnhNxYVZIULT3fiww",
  pro: "price_1ShoSbBWnhNxYVZIiBh24UyM",
  business: "price_1ShoSxBWnhNxYVZICr7FvJch",
};

const priceIds = isRemote ? PROD_PRICE_IDS : DEV_PRICE_IDS;

const plans = [
  {
    id: "plan_starter",
    name: "Starter",
    stripePriceId: priceIds.starter,
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
    stripePriceId: priceIds.pro,
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
    stripePriceId: priceIds.business,
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

console.log(`Seeding database (${isRemote ? "REMOTE/PRODUCTION" : "LOCAL"})...\n`);

if (isRemote && priceIds.starter.includes("REPLACE")) {
  console.error("ERROR: Please update PROD_PRICE_IDS in seed.mjs with your Stripe price IDs");
  process.exit(1);
}

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
