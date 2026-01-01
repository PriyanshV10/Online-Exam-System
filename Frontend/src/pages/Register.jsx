import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { User, Mail, Lock, ArrowRight, GraduationCap } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful. Please wait for admin approval.");

      // Optional: redirect to login after few seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      if (err.response?.data) {
        const res = err.response.data;
        const msg = res.message || "Registration failed";

        setMessage(msg);
      } else {
        setMessage("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/30 ring-1 ring-white/20">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join us and start your assessment</p>
        </div>

        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="text"
                  className="input-field !pl-12"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${message.includes("successful")
                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-500/20"
                : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-500/20"
                }`}>
                {message}
              </div>
            )}

            <button
              className="btn-primary w-full flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-500 dark:hover:text-purple-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
