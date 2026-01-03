import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import { User, Shield } from "lucide-react";

export default function Dashboard({ user }) {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 animate-fade-in shadow-xl relative overflow-hidden max-w-7xl mx-auto mt-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                <img
                  src={user.role === "ADMIN" ? `/assets/admin_avatar.png` : "/assets/student.png"}
                  className="w-full h-full object-cover"
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<svg stroke="currentColor" fill="none" class="text-gray-400 w-10 h-10" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                  }}
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-white dark:bg-zinc-900 rounded-full p-1 border border-gray-200 dark:border-white/10">
              {user.role === "ADMIN" ? <Shield size={16} className="text-purple-500 dark:text-purple-400" /> : <User size={16} className="text-blue-500 dark:text-blue-400" />}
            </div>
          </div>

          <div className="text-center md:text-left z-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <div className="flex flex-col md:flex-row items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
              <span className="bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-gray-300 px-3 py-0.5 rounded-full border border-gray-200 dark:border-white/10 uppercase text-xs font-bold tracking-wider">
                {user.role}
              </span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="animate-fade-in delay-100">
          {user.role === "ADMIN" ? <AdminDashboard /> : <StudentDashboard />}
        </div>
      </div>
    </div>
  );
}
