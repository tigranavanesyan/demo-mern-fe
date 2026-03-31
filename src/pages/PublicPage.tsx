import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function PublicPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <p className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Public Page Description
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Open Information Hub</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            This page is intentionally accessible to everyone. It gives visitors a quick overview
            of the project, architecture, and technology stack without requiring authentication.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Home
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Login
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Back to dashboard ({user?.role})
              </Link>
            )}
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Node.js API with structured auth endpoints",
            "MongoDB user storage with role metadata",
            "JWT issuance and cookie-based session handling",
            "React route-based UX for public and protected views",
            "Tailwind utility system for rapid design consistency",
            "Vercel-ready frontend deployment strategy",
          ].map((point) => (
            <article key={point} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-300">{point}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-xl font-semibold text-indigo-200">Visitor Guidance</h2>
          <p className="mt-3 text-slate-300">
            Start on the landing page to understand system architecture, use login/register to test
            authentication, and open dashboard/admin routes to validate protected and role-based flows.
          </p>
        </section>
      </div>
    </main>
  );
}
