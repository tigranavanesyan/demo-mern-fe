import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function PublicPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-xl bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">Public page</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Visible for all users
        </h1>
        <p className="mt-4 text-slate-600">
          You can open this route whether you are logged in or not.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Back to dashboard ({user?.role})
            </Link>
          )}
        </div>
        </div>
      </div>
    </main>
  );
}
