import { useEffect, useState } from "react";
import api from "../api/api";
import ExamManagement from "../components/ExamManagement";
import UserManagement from "../components/UserManagent";
import ExamList from "../components/ExamList";

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
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen w-3/4 mx-auto bg-[#101010] text-white mt-8">
      <div className="flex justify-between gap-4 font-medium">
        {/* No of exams taken, total exams, avg score, time spent */}
        <div className="w-1/4 bg-[#282828] p-4 rounded-2xl flex gap-2">
          <div className="flex items-center">
            <img
              src={`/assets/exam.png`}
              className="w-16 p-2 h-16 mr-4"
              alt="exam"
            />
          </div>
          <div className="flex flex-col justify-around">
            <div className="text-4xl font-bold">{stats.examsTaken}</div>
            <div className="text-sm">Exams Taken</div>
          </div>
        </div>
        <div className="w-1/4 bg-[#282828] p-4 rounded-2xl flex gap-2">
          <div className="flex items-center">
            <img
              src={`/assets/exam.png`}
              className="w-16 p-2 h-16 mr-4"
              alt="exam"
            />
          </div>
          <div className="flex flex-col justify-around">
            <div className="text-4xl font-bold">{stats.totalExams}</div>
            <div className="text-sm">Exams Available</div>
          </div>
        </div>
        <div className="w-1/4 bg-[#282828] p-4 rounded-2xl flex gap-2">
          <div className="flex items-center">
            <img
              src={`/assets/medal.png`}
              className="p-2 w-16 h-16 mr-4"
              alt="exam"
            />
          </div>
          <div className="flex flex-col justify-around">
            <div className="text-4xl font-bold">{stats.averageScore.toFixed(0)} %</div>
            <div className="text-sm">Average Score</div>
          </div>
        </div>
        <div className="w-1/4 bg-[#282828] p-4 rounded-2xl flex gap-2">
          <div className="flex items-center">
            <img
              src={`/assets/time.png`}
              className="p-2 w-16 h-16 mr-4"
              alt="exam"
            />
          </div>
          <div className="flex flex-col justify-around">
            <div className="text-4xl font-bold">{(stats.totalSeconds / 60).toFixed(1)}</div>
            <div className="text-sm">Minutes Spent</div>
          </div>
        </div>
      </div>

      <ExamList refreshStats={fetchStats} />
      
    </div>
  );
}
