import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle(credential);
      navigate("/dashboard");
    } catch {
      setError("Google login failed. Please try again.");
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
            Login Page Description
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Secure Sign In</h1>
          <p className="mt-4 text-slate-300">
            This page authenticates returning users through JWT and cookie-based sessions. The UI is
            intentionally simple and focused to minimize friction and support quick access.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>- Session persisted via HTTP-only cookies</li>
            <li>- Protected route support after successful login</li>
            <li>- Clear error messaging for invalid credentials</li>
          </ul>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8"
        >
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <p className="mt-1 text-sm text-slate-400">Enter your account details to continue.</p>

          <label className="mt-6 block text-sm font-medium text-slate-200">
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
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {googleClientId ? (
            <div className="mt-4">
              <p className="mb-2 text-center text-xs uppercase tracking-wide text-slate-400">
                or continue with
              </p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      void handleGoogleSuccess(credentialResponse.credential);
                      return;
                    }
                    setError("Google login did not return a credential.");
                  }}
                  onError={() => {
                    setError("Google login failed. Please try again.");
                  }}
                  useOneTap={false}
                />
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-sm text-slate-300">
            No account?{" "}
            <Link className="text-indigo-300 hover:underline" to="/register">
              Register
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
