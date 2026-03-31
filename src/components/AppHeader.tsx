import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  label: string;
  to: string;
  canAccess: boolean;
};

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
    </header>
  );
}
