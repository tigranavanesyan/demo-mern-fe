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
            <p className="mt-2 text-slate-300">
              Subscriptions with prorated upgrades when you change plans, and metered billing if you go past your included credits.
            </p>
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

        <section
          aria-labelledby="how-it-works-heading"
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h2 id="how-it-works-heading" className="text-lg font-semibold text-indigo-200">
            How it works
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300 marker:text-indigo-400">
            <li>
              <span className="font-medium text-slate-200">Pick billing and a plan.</span> Choose monthly or yearly, then select Starter, Pro, or Enterprise. Each plan includes a set number of credits per billing period.
            </li>
            <li>
              <span className="font-medium text-slate-200">Pay securely with Stripe.</span> For a new subscription you are sent to Stripe Checkout to enter payment details. You can apply a promotion code on checkout when available.
            </li>
            <li>
              <span className="font-medium text-slate-200">Already subscribed?</span> If you switch to another plan while logged in, your subscription updates right away. Stripe issues a prorated invoice for the difference so you only pay for what you use in the current period.
            </li>
            <li>
              <span className="font-medium text-slate-200">Credits and overage.</span> Your included credits reset each billing cycle. Usage beyond that is charged as metered overage according to your plan.
            </li>
            <li>
              <span className="font-medium text-slate-200">One-time add-ons.</span> The Premium Template is a separate one-time purchase through checkout. It is not part of your subscription and does not renew.
            </li>
          </ol>
        </section>

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
