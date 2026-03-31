import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch {
      setError("Unable to register with provided data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AppHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
          <p className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Register Page Description
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Create a New Account</h1>
          <p className="mt-4 text-slate-300">
            This page onboards new users into the authentication system and instantly grants access
            to the protected dashboard after successful registration.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>- Captures user identity and credentials</li>
            <li>- Validates minimum password length</li>
            <li>- Starts secure session via JWT and cookies</li>
          </ul>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8"
        >
          <h2 className="text-2xl font-semibold text-white">Register</h2>
          <p className="mt-1 text-sm text-slate-400">Create your account to access private pages.</p>

          <label className="mt-6 block text-sm font-medium text-slate-200">
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-300 focus:ring"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-300 focus:ring"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-indigo-300 focus:ring"
            />
          </label>

          {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>

          <p className="mt-4 text-sm text-slate-300">
            Already registered?{" "}
            <Link className="text-indigo-300 hover:underline" to="/login">
              Login
            </Link>
          </p>
          <Link to="/" className="mt-3 block text-sm font-medium text-slate-400 hover:underline">
            Back to landing page
          </Link>
        </form>
      </div>
    </main>
  );
}
