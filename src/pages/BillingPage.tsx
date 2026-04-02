import { useEffect, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";
import { createBillingPortal, fetchBillingStatus, recordCreditUsage } from "../lib/billing";

type BillingState = {
  billing: {
    subscriptionStatus: string;
    subscriptionPriceId: string | null;
    currentPeriodEnd: string | null;
    credits: { included: number; used: number; remaining: number };
  };
  purchases: Array<{
    _id: string;
    productKey: string;
    amountTotal: number;
    currency: string;
    fulfilledAt?: string;
  }>;
  usageHistory: Array<{
    _id: string;
    quantity: number;
    status: "pending" | "sent" | "failed";
    sourceEventId: string;
    createdAt: string;
  }>;
};

export default function BillingPage() {
  const { refreshUser } = useAuth();
  const [data, setData] = useState<BillingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchBillingStatus();
        setData(result);
      } catch {
        setMessage("Could not load billing status.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const openPortal = async () => {
    setMessage("");
    try {
      const result = await createBillingPortal();
      window.location.href = result.url;
    } catch {
      setMessage("Could not open Stripe customer portal.");
    }
  };

  const refreshData = async () => {
    const result = await fetchBillingStatus();
    setData(result);
  };

  const handleSpendCredits = async (quantity: number, label: string) => {
    setMessage("");
    try {
      const sourceEventId = `fun-${quantity}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await recordCreditUsage(quantity, sourceEventId);
      setMessage(`${label} complete. Spent ${quantity} credits.`);
      await Promise.all([refreshData(), refreshUser()]);
    } catch {
      setMessage("Could not spend credits. Make sure you have an active test subscription first.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <AppHeader />
        <section className="mx-auto max-w-5xl px-6 py-12">
          <p>Loading billing data...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="text-2xl font-semibold">Billing</h1>
          <div
            className="mt-4 rounded-lg border border-indigo-500/35 bg-indigo-950/30 p-4"
            aria-labelledby="stripe-features-heading"
          >
            <h2 id="stripe-features-heading" className="text-sm font-semibold text-indigo-200">
              Payments powered by Stripe
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              This app uses Stripe for billing. Here is what is wired up for you:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300 marker:text-indigo-400">
              <li>
                <span className="font-medium text-slate-200">Checkout</span> — New subscriptions (Starter, Pro,
                Enterprise, monthly or yearly) and the one-time Premium Template purchase go through Stripe Checkout.
              </li>
              <li>
                <span className="font-medium text-slate-200">Customer Portal</span> — The button below opens
                Stripe&apos;s hosted page where you can update payment methods, download invoices, or cancel your
                subscription.
              </li>
              <li>
                <span className="font-medium text-slate-200">Plan changes</span> — If you change plan or switch between
                monthly and yearly billing while logged in, Stripe updates your subscription and applies prorated
                charges where applicable.
              </li>
              <li>
                <span className="font-medium text-slate-200">Credits &amp; usage</span> — Included credits are tracked
                here; usage you trigger in the Credit Playground is reported for metered overage billing (beyond your
                included amount), consistent with your plan in Stripe.
              </li>
              <li>
                <span className="font-medium text-slate-200">Automatic sync</span> — After checkout and when your
                subscription renews or changes, the app updates your status and purchase history from Stripe so what you
                see here matches your Stripe account.
              </li>
            </ul>
          </div>
          <p className="mt-6 text-slate-300">
            Status: <span className="uppercase text-indigo-300">{data?.billing.subscriptionStatus ?? "inactive"}</span>
          </p>
          <p className="mt-1 text-slate-300">Price ID: {data?.billing.subscriptionPriceId ?? "None"}</p>
          <p className="mt-1 text-slate-300">
            Period End: {data?.billing.currentPeriodEnd ? new Date(data.billing.currentPeriodEnd).toLocaleDateString() : "N/A"}
          </p>
          <div className="mt-4 rounded-lg border border-slate-700 p-4">
            <h2 className="text-lg font-medium text-indigo-200">Credit Usage</h2>
            <p className="mt-2 text-sm text-slate-300">Included: {data?.billing.credits.included ?? 0}</p>
            <p className="text-sm text-slate-300">Used: {data?.billing.credits.used ?? 0}</p>
            <p className="text-sm text-slate-300">Remaining: {data?.billing.credits.remaining ?? 0}</p>
          </div>
          <button
            onClick={() => void openPortal()}
            className="mt-5 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Manage Subscription (Stripe Portal)
          </button>
          <div className="mt-6 rounded-lg border border-slate-700 p-4">
            <h2 className="text-lg font-medium text-indigo-200">Credit Playground</h2>
            <p className="mt-2 text-sm text-slate-300">
              Burn credits in fun ways to test usage billing.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => void handleSpendCredits(5, "Pixel rocket launch")}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
              >
                Launch pixel rocket (-5)
              </button>
              <button
                onClick={() => void handleSpendCredits(25, "Meme generator overload")}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
              >
                Overload meme generator (-25)
              </button>
              <button
                onClick={() => void handleSpendCredits(100, "AI dragon render")}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
              >
                Render AI dragon (-100)
              </button>
            </div>
          </div>
          {message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Recent One-time Purchases</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {data?.purchases?.length ? (
              data.purchases.map((purchase) => (
                <p key={purchase._id}>
                  {purchase.productKey} - {(purchase.amountTotal / 100).toFixed(2)}{" "}
                  {purchase.currency.toUpperCase()}
                </p>
              ))
            ) : (
              <p>No purchases yet.</p>
            )}
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Credit Spending History</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {data?.usageHistory?.length ? (
              data.usageHistory.map((entry) => (
                <p key={entry._id}>
                  -{entry.quantity} credits · {entry.status} · {new Date(entry.createdAt).toLocaleString()}
                </p>
              ))
            ) : (
              <p>No credit spending yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
