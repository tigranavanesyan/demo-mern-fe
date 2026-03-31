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
    <main className="min-h-screen bg-slate-900 text-white">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-8">
        <p className="text-sm text-slate-400">Admin page</p>
        <h1 className="mt-2 text-3xl font-semibold">Only admin can access this</h1>
        <p className="mt-4 text-slate-300">{status}</p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
        >
          Back to dashboard
        </Link>
        </div>
      </div>
    </main>
  );
}
