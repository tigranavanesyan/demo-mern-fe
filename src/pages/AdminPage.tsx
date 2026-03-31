import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { api } from "../lib/api";

type AdminResponse = {
  message: string;
  role: "admin" | "user";
};

export default function AdminPage() {
  const [status, setStatus] = useState("Loading admin data...");

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const { data } = await api.get<AdminResponse>("/auth/admin-info");
        setStatus(`${data.message} (${data.role})`);
      } catch {
        setStatus("Could not load admin info.");
      }
    };

    void getAdminData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <p className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Admin Page Description
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Role-Based Admin Area</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This page demonstrates authorization in action. Only users with the admin role can open
            this route, proving both frontend route guarding and backend role validation.
          </p>
          <p className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-200">{status}</p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Back to dashboard
          </Link>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Role-based middleware checks user permissions",
            "Protected route component blocks non-admin users",
            "Admin endpoint response validates authorization flow",
          ].map((point) => (
            <article key={point} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-300">{point}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
