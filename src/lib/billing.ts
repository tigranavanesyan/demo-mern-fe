import { api } from "./api";

export type BillingPlanKey = "starter" | "pro" | "enterprise";
export type BillingInterval = "monthly" | "yearly";

export async function createSubscriptionCheckout(planKey: BillingPlanKey, interval: BillingInterval) {
  const { data } = await api.post<{ url?: string; updated?: boolean; message?: string }>(
    "/billing/checkout-session",
    {
      mode: "subscription",
      planKey,
      interval,
    }
  );
  return data;
}

export async function createOneTimeCheckout(productKey: string) {
  const { data } = await api.post<{ url?: string }>("/billing/checkout-session", {
    mode: "one_time",
    productKey,
  });
  return data;
}

export async function createBillingPortal() {
  const { data } = await api.post<{ url: string }>("/billing/portal-session");
  return data;
}

export async function fetchBillingStatus() {
  const { data } = await api.get("/billing/status");
  return data;
}
