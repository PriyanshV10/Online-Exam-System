import { useEffect, useState } from "react";
import api from "../api/api";
import ExamList from "../components/ExamList";
import { Trophy, Clock, BookOpen, CheckCircle, BarChart3 } from "lucide-react";

export default function StudentDashboard() {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
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
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass-panel text-red-400 p-6 rounded-xl border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Exams Taken",
      value: stats.examsTaken,
      icon: CheckCircle,
      color: "from-blue-500 to-cyan-500",
      delay: "delay-0",
    },
    {
      title: "Available Exams",
      value: stats.totalExams,
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      delay: "delay-100",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore.toFixed(0)}%`,
      icon: Trophy,
      color: "from-amber-400 to-orange-500",
      delay: "delay-200",
    },
    {
      title: "Time Invested",
      value: `${(stats.totalSeconds / 60).toFixed(1)}m`,
      icon: Clock,
      color: "from-emerald-400 to-green-600",
      delay: "delay-300",
    },
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 w-full max-w-7xl mx-auto">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Student Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Track your progress and assess your skills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`glass-card p-6 rounded-2xl relative overflow-hidden group animate-fade-in ${stat.delay}`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:opacity-20 transition-opacity`} />

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 shadow-lg shadow-black/5 dark:shadow-black/20`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <BarChart3 size={16} className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in delay-300">
        <ExamList refreshStats={fetchStats} />
      </div>
    </div>
  );
}
