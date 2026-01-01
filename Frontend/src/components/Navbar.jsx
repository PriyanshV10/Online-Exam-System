import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { LogOut, User, BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="glass-panel rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/20">
          <Link to="/" className="group flex items-center gap-2">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <GraduationCap size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-400">
              ExamPortal
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-2" />
            {user ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive('/') || isActive('/dashboard')
                    ? "bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-white"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                    }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1 uppercase tracking-wider">{user.role}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl border border-red-500/20 transition-all active:scale-95 group"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className={`px-5 py-2 rounded-xl font-medium transition-all ${isActive('/') || isActive('/login')
                    ? "bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-white"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                    }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-white px-5 py-2 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
