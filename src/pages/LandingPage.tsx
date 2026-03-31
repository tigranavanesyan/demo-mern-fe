import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const stackItems = [
    {
      name: "Node.js + Express",
      description: "Backend API for authentication, sessions, and role-based route protection.",
    },
    {
      name: "MongoDB + Mongoose",
      description: "Stores user accounts and roles with a clean, scalable schema.",
    },
    {
      name: "React + TypeScript",
      description: "Creates fast client-side pages with reliable typed components.",
    },
    {
      name: "Tailwind CSS",
      description: "Provides a modern, responsive UI system with consistent spacing and hierarchy.",
    },
    {
      name: "JWT + HTTP-only Cookies",
      description: "Handles secure login sessions and persistent auth state across page reloads.",
    },
    {
      name: "Vercel Deployment",
      description: "Delivers the frontend quickly with simple CI/CD and production hosting.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-8 sm:p-12">
          <p className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Landing Page Description
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            Full-Stack MERN Authentication Portfolio
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This project demonstrates production-oriented architecture using Node.js, MongoDB,
            React, Tailwind CSS, JWT authentication, secure cookie sessions, and deployment on
            Vercel. The experience is built to be intuitive for visitors and informative for
            technical reviewers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pricing"
              className="rounded-md border border-indigo-400 px-5 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20"
            >
              View Pricing
            </Link>
            <Link
              to="/public"
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Explore Public Page
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium hover:bg-indigo-400"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Technology Overview</h2>
          <p className="mt-2 text-slate-300">
            Each technology below contributes to security, scalability, and clean user experience.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stackItems.map((item) => (
              <article key={item.name} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-lg font-semibold text-indigo-200">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Project Goal</p>
            <p className="mt-2 text-slate-200">
              Showcase full-stack implementation quality and explain every major technical choice.
            </p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">UX Principle</p>
            <p className="mt-2 text-slate-200">
              Keep navigation predictable and page descriptions clear so visitors always know context.
            </p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Security Focus</p>
            <p className="mt-2 text-slate-200">
              Use role-based access control, protected routes, JWT, and cookies for safe sessions.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
