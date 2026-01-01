import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Mail, Lock, ArrowRight, BookOpen } from "lucide-react";
import Toast from "../components/Toast";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      // store user in App state
      setUser(res.data.data);

      showToast("Login successful!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      if (err.response?.data) {
        const res = err.response.data;
        const message = res.message || "Login failed";
        showToast(message, "error");
      } else {
        showToast("Server not reachable", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mb-4 shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to continue your learning journey</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="email"
                  className="input-field !pl-12"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="password"
                  className="input-field !pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="btn-primary w-full flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-500 dark:hover:text-purple-300 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
