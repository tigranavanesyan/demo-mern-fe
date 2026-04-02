import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  label: string;
  to: string;
  canAccess: boolean;
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function planDisplayName(planKey: "starter" | "pro" | "enterprise" | null | undefined) {
  if (!planKey) return "Free";
  const map = { starter: "Starter", pro: "Pro", enterprise: "Enterprise" } as const;
  return map[planKey];
}

export function AppHeader() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems: NavItem[] = [
    { label: "Landing", to: "/", canAccess: true },
    { label: "Pricing", to: "/pricing", canAccess: true },
    { label: "Public", to: "/public", canAccess: true },
    { label: "Dashboard", to: "/dashboard", canAccess: isAuthenticated },
    { label: "Billing", to: "/billing", canAccess: isAuthenticated },
    {
      label: "Admin",
      to: "/admin",
      canAccess: isAuthenticated && user?.role === "admin",
    },
    { label: "Login", to: "/login", canAccess: !isAuthenticated },
    { label: "Register", to: "/register", canAccess: !isAuthenticated },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 shadow-lg backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-sm font-semibold tracking-wide text-indigo-300">
          MERN Auth Portfolio
        </Link>
        <div className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          if (!item.canAccess) {
            return (
              <span
                key={item.to}
                className="cursor-not-allowed rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-500"
                title="You do not have access to this page"
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                  : "border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        </div>
      </nav>

      {isAuthenticated && user && (
        <div className="mx-auto max-w-6xl border-t border-slate-800 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-600/30 text-xs font-semibold text-indigo-100"
              aria-hidden
            >
              {initialsFromName(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-100">{user.email}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-md border border-slate-600 bg-slate-900/80 px-2 py-0.5 text-slate-200">
                  {planDisplayName(user.billing?.activePlanKey)}
                </span>
                {user.billing?.activePlanKey && user.billing.activeInterval && (
                  <span className="rounded-md border border-slate-700 px-2 py-0.5 capitalize text-slate-300">
                    {user.billing.activeInterval === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                )}
                <span className="text-emerald-400/90">
                  Credits: {user.billing?.credits?.remaining ?? 0}
                  {typeof user.billing?.credits?.included === "number" && (
                    <span className="text-slate-500"> / {user.billing.credits.included} included</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
