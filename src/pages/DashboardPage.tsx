import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Logged in as</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {user?.name}
            </h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Active Projects", value: "04" },
            { label: "Client Messages", value: "12" },
            { label: "Pending Tasks", value: "09" },
          ].map((item) => (
            <article key={item.label} className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {item.value}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
