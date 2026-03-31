import { useEffect, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { createBillingPortal, fetchBillingStatus } from "../lib/billing";

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
};

export default function BillingPage() {
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
          <p className="mt-2 text-slate-300">
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
      </section>
    </main>
  );
}
