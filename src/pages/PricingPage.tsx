import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import {
  createBillingPortal,
  createOneTimeCheckout,
  createSubscriptionCheckout,
  fetchBillingStatus,
} from "../lib/billing";

const plans = [
  { key: "starter", name: "Starter", monthly: "$19", yearly: "$190", credits: "1,000 included credits" },
  { key: "pro", name: "Pro", monthly: "$49", yearly: "$490", credits: "5,000 included credits" },
  { key: "enterprise", name: "Enterprise", monthly: "$149", yearly: "$1,490", credits: "15,000 included credits" },
] as const;

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [message, setMessage] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [activePlanKey, setActivePlanKey] = useState<"starter" | "pro" | "enterprise" | null>(null);
  const [activeInterval, setActiveInterval] = useState<"monthly" | "yearly" | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setActivePlanKey(null);
      setActiveInterval(null);
      return;
    }
    void fetchBillingStatus().then((res) => {
      setActivePlanKey(res.billing.activePlanKey ?? null);
      setActiveInterval(res.billing.activeInterval ?? null);
    });
  }, [isAuthenticated]);

  const refreshBilling = () => {
    if (!isAuthenticated) return;
    void fetchBillingStatus().then((res) => {
      setActivePlanKey(res.billing.activePlanKey ?? null);
      setActiveInterval(res.billing.activeInterval ?? null);
    });
  };

  const handleManageSubscription = async () => {
    setLoadingKey("portal");
    setMessage("");
    try {
      const result = await createBillingPortal();
      window.location.href = result.url;
    } catch {
      setMessage("Could not open subscription management. Try the Billing page.");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleSubscribe = async (planKey: "starter" | "pro" | "enterprise") => {
    setLoadingKey(planKey);
    setMessage("");
    try {
      const result = await createSubscriptionCheckout(planKey, interval);
      if (result.updated) {
        setMessage(result.message ?? "Plan updated successfully.");
        refreshBilling();
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
            <p className="mt-3 text-sm text-slate-400">
              Stripe handles checkout, the customer portal for managing payment methods and invoices, prorated plan
              changes, usage-based credit overage, and keeping your subscription state in sync. See the{" "}
              <Link to="/billing" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                Billing
              </Link>{" "}
              page for a full list of what is implemented.
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



        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentTier = Boolean(activePlanKey && plan.key === activePlanKey);
            const wantsCadenceSwitch =
              isCurrentTier && activeInterval !== null && activeInterval !== interval;

            const planButtonLabel = (() => {
              if (!activePlanKey) return "Choose Plan";
              if (!isCurrentTier) return "Change plan";
              if (wantsCadenceSwitch) {
                return interval === "yearly" ? "Switch to yearly billing" : "Switch to monthly billing";
              }
              return "Manage your subscription";
            })();

            const planAction = () => {
              if (!activePlanKey || !isCurrentTier) {
                return handleSubscribe(plan.key);
              }
              if (wantsCadenceSwitch) {
                return handleSubscribe(plan.key);
              }
              return handleManageSubscription();
            };

            const planLoading = wantsCadenceSwitch
              ? loadingKey === plan.key
              : isCurrentTier
                ? loadingKey === "portal"
                : loadingKey === plan.key;

            return (
              <article
                key={plan.key}
                className={`rounded-xl border bg-slate-900/70 p-6 ${
                  isCurrentTier ? "border-indigo-500/80 ring-1 ring-indigo-500/40" : "border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-xl font-semibold text-indigo-200">{plan.name}</h2>
                  {isCurrentTier ? (
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-medium text-indigo-200">
                      Current plan
                      {activeInterval ? ` · ${activeInterval}` : ""}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-3xl font-bold">{interval === "monthly" ? plan.monthly : plan.yearly}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.credits}</p>
                {wantsCadenceSwitch ? (
                  <p className="mt-3 text-sm text-amber-200/90">
                    You are on {plan.name} with {activeInterval} billing. Use the button below to move to{" "}
                    {interval} billing (prorated).
                  </p>
                ) : null}
                <button
                  onClick={() => void planAction()}
                  disabled={planLoading}
                  className="mt-5 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
                >
                  {planLoading ? "Loading..." : planButtonLabel}
                </button>
              </article>
            );
          })}
        </div>

        <section
          aria-labelledby="how-it-works-heading"
          className="mt-10 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <h2 id="how-it-works-heading" className="text-lg font-semibold text-indigo-200">
            How it works
          </h2>
          <div className="mt-4 rounded-lg border border-emerald-500/35 bg-emerald-950/25 p-4">
            <h3 className="text-sm font-semibold text-emerald-200">Testing and demo use</h3>
            <p className="mt-2 text-sm text-slate-300">
              This project is set up for testing and learning. You can try subscriptions and one-time purchases without spending real money while the backend uses Stripe in test mode—experiment freely.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              In Stripe Checkout, use the standard test card number{" "}
              <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-emerald-100">4242 4242 4242 4242</code>
              , any future expiry date, any billing details if the form asks for them, and any three-digit CVC. That flow matches{" "}
              <a
                href="https://docs.stripe.com/testing#cards"
                className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
                target="_blank"
                rel="noreferrer"
              >
                Stripe&apos;s testing documentation
              </a>
              .
            </p>
          </div>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-300 marker:text-indigo-400">
            <li>
              <span className="font-medium text-slate-200">Pick billing and a plan.</span> Choose monthly or yearly, then select Starter, Pro, or Enterprise. Each plan includes a set number of credits per billing period.
            </li>
            <li>
              <span className="font-medium text-slate-200">Pay securely with Stripe.</span> For a new subscription you are sent to Stripe Checkout to enter payment details (use the test card above in this demo). You can apply a promotion code on checkout when available.
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
