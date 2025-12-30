import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Types
export interface Plan {
  id: string;
  name: string;
  stripePriceId: string;
  monthlyLimit: number;
  siteLimit: number;
  price: number;
  features: string | null;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  planId: string | null;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  verificationsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface Site {
  id: string;
  domain: string;
  name: string | null;
  showBadge: boolean;
  createdAt: string;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  siteId: string | null;
  postId: string | null;
  postTitle: string | null;
  contentPreview: string | null;
  status: string | null;
  claimsCount: number | null;
  tokensUsed: number | null;
  createdAt: string;
}

export interface VerificationDetail {
  id: string;
  userId: string;
  siteId: string | null;
  postId: string | null;
  postTitle: string | null;
  content: string | null;
  result: string | null;
  status: string | null;
  claimsCount: number | null;
  tokensUsed: number | null;
  createdAt: string;
}

// API functions
export async function getPlans(): Promise<Plan[]> {
  const { data } = await api.get("/subscriptions/plans");
  return data;
}

export async function getCurrentSubscription(): Promise<{
  subscription: Subscription | null;
  plan: Plan | null;
}> {
  const { data } = await api.get("/subscriptions/current");
  return data;
}

export async function createCheckout(priceId: string): Promise<{ url: string }> {
  const { data } = await api.post("/subscriptions/checkout", { priceId });
  return data;
}

export async function createPortalSession(): Promise<{ url: string }> {
  const { data } = await api.post("/subscriptions/portal");
  return data;
}

export async function syncSubscription(): Promise<{
  synced: boolean;
  hasActiveSubscription?: boolean;
  message?: string;
}> {
  const { data } = await api.post("/subscriptions/sync");
  return data;
}

export async function getSites(): Promise<Site[]> {
  const { data } = await api.get("/sites");
  return data;
}

export async function updateSite(
  id: string,
  updates: { showBadge?: boolean; name?: string }
): Promise<void> {
  await api.patch(`/sites/${id}`, updates);
}

export async function deleteSite(id: string): Promise<void> {
  await api.delete(`/sites/${id}`);
}

export async function getVerificationHistory(
  limit = 50,
  offset = 0
): Promise<VerificationRecord[]> {
  const { data } = await api.get("/verify/history", {
    params: { limit, offset },
  });
  return data;
}

export async function getVerification(id: string): Promise<VerificationDetail> {
  const { data } = await api.get(`/verify/${id}`);
  return data;
}
