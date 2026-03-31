import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { createOneTimeCheckout, createSubscriptionCheckout } from "../lib/billing";

const plans = [
  { key: "starter", name: "Starter", monthly: "$19", yearly: "$190", credits: "1,000 included credits" },
  { key: "pro", name: "Pro", monthly: "$49", yearly: "$490", credits: "5,000 included credits" },
  { key: "enterprise", name: "Enterprise", monthly: "$149", yearly: "$1,490", credits: "15,000 included credits" },
] as const;

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [message, setMessage] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleSubscribe = async (planKey: "starter" | "pro" | "enterprise") => {
    setLoadingKey(planKey);
    setMessage("");
    try {
      const result = await createSubscriptionCheckout(planKey, interval);
      if (result.updated) {
        setMessage(result.message ?? "Plan updated successfully.");
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setMessage("Could not start Stripe checkout. Please try again.");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleOneTime = async () => {
    setLoadingKey("one_time");
    setMessage("");
    try {
      const result = await createOneTimeCheckout("premium_template");
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setMessage("Could not start one-time checkout.");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Pricing</h1>
            <p className="mt-2 text-slate-300">Subscriptions with prorated upgrades and metered credit overage.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 p-1">
            <button
              onClick={() => setInterval("monthly")}
              className={`rounded-md px-3 py-1.5 text-sm ${interval === "monthly" ? "bg-indigo-500 text-white" : "text-slate-300"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`rounded-md px-3 py-1.5 text-sm ${interval === "yearly" ? "bg-indigo-500 text-white" : "text-slate-300"}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.key} className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-semibold text-indigo-200">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold">{interval === "monthly" ? plan.monthly : plan.yearly}</p>
              <p className="mt-2 text-sm text-slate-300">{plan.credits}</p>
              <button
                onClick={() => void handleSubscribe(plan.key)}
                disabled={loadingKey === plan.key}
                className="mt-5 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
              >
                {loadingKey === plan.key ? "Loading..." : "Choose Plan"}
              </button>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold text-indigo-200">One-time Digital Purchase</h3>
          <p className="mt-2 text-slate-300">Buy Premium Template once and unlock permanent access.</p>
          <button
            onClick={() => void handleOneTime()}
            disabled={loadingKey === "one_time"}
            className="mt-4 rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
          >
            {loadingKey === "one_time" ? "Loading..." : "Buy for one-time payment"}
          </button>
        </section>
        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
      </section>
    </main>
  );
}
