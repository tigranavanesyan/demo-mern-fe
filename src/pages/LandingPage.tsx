import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          MERN Portfolio Project
        </p>
        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
          Build secure client-ready apps with the MERN stack
        </h1>
        <p className="mt-5 max-w-2xl text-slate-300">
          This demo shows authentication, protected routing, and a clean
          full-stack architecture using MongoDB, Express, React, and Node.js.
        </p>
        <div className="mt-10 flex gap-3">
          <Link
            to="/register"
            className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium hover:bg-indigo-400"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
