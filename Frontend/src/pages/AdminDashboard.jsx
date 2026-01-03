import { useEffect, useState } from "react";
import api from "../api/api";
import { FileText, CheckCircle, Users, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-slate-900 dark:text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-500 p-8">{error}</div>;
  }

  const statCards = [
    { title: "Total Exams", value: stats.totalExams, icon: FileText, color: "from-blue-500 to-indigo-600" },
    { title: "Published", value: stats.publishedExams, icon: CheckCircle, color: "from-green-500 to-emerald-600" },
    { title: "Registered", value: stats.totalUsers, icon: Users, color: "from-orange-500 to-red-600" },
    { title: "Active Users", value: stats.approvedUsers, icon: UserCheck, color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of system statistics and management</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:opacity-20 transition-opacity`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 shadow-lg shadow-black/5 dark:shadow-black/20`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link to="/admin/users" className="glass-panel p-6 rounded-2xl group hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Users size={20} className="text-purple-600 dark:text-purple-500" /> User Management
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Review registered students, approve/reject accounts, and manage user access.</p>
            </div>
          </Link>

          <Link to="/admin/exams" className="glass-panel p-6 rounded-2xl group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText size={20} className="text-blue-600 dark:text-blue-500" /> Exam Management
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Create new exams, edit existing ones, publish scores, and manage questions.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
