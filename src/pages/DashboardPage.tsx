import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, updateRole } = useAuth();
  const [roleMessage, setRoleMessage] = useState("");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleRoleChange = async (nextRole: "user" | "admin") => {
    if (!user || user.role === nextRole) {
      return;
    }

    setRoleMessage("");
    setIsUpdatingRole(true);

    try {
      await updateRole(nextRole);
      setRoleMessage(`Role updated to ${nextRole}.`);
    } catch {
      setRoleMessage("Could not update role right now.");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <p className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Dashboard Page Description
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Welcome, {user?.name}</h1>
              <p className="mt-1 text-slate-300">{user?.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-indigo-300">Role: {user?.role}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-emerald-300">
                Plan: {user?.billing?.subscriptionStatus ?? "inactive"}
              </p>
              <p className="mt-4 max-w-3xl text-slate-300">
                This authenticated dashboard verifies secure login state, exposes role-aware
                navigation, and summarizes key architecture ideas used in this MERN project.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => void handleRoleChange("user")}
                  disabled={isUpdatingRole || user?.role === "user"}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Become User
                </button>
                <button
                  onClick={() => void handleRoleChange("admin")}
                  disabled={isUpdatingRole || user?.role === "admin"}
                  className="rounded-md border border-indigo-500 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Become Admin
                </button>
              </div>
              {roleMessage ? <p className="mt-3 text-sm text-emerald-300">{roleMessage}</p> : null}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/public"
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Open Public Page
            </Link>
              <Link
                to="/pricing"
                className="rounded-md border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20"
              >
                View Pricing
              </Link>
              <Link
                to="/billing"
                className="rounded-md border border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
              >
                Open Billing
              </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Open Admin Page
              </Link>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Authentication Layer",
              text: "JWT-based identity checks and secure cookie sessions for seamless UX.",
            },
            {
              title: "Route Protection",
              text: "Private routes and role guards prevent unauthorized access to sensitive pages.",
            },
            {
              title: "Frontend Architecture",
              text: "React + TypeScript components with centralized auth context and clear navigation.",
            },
            {
              title: "Data Layer",
              text: "MongoDB stores account profiles and role metadata for access control decisions.",
            },
            {
              title: "Design System",
              text: "Tailwind utility patterns keep spacing, typography, and components consistent.",
            },
            {
              title: "Deployment",
              text: "Vercel-ready frontend setup supports quick preview and production publishing.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-lg font-semibold text-indigo-200">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
