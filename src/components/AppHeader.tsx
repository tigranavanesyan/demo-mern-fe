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
    { label: "Public", to: "/public", canAccess: true },
    { label: "Dashboard", to: "/dashboard", canAccess: isAuthenticated },
    {
      label: "Admin",
      to: "/admin",
      canAccess: isAuthenticated && user?.role === "admin",
    },
    { label: "Login", to: "/login", canAccess: !isAuthenticated },
    { label: "Register", to: "/register", canAccess: !isAuthenticated },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          if (!item.canAccess) {
            return (
              <span
                key={item.to}
                className="cursor-not-allowed rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-400"
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
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
