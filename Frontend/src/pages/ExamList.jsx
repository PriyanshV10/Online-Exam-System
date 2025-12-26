import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/exams")
      .then((res) => setExams(res.data.data))
      .catch(() => alert("Failed to load exams"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading exams...</div>;
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Available Exams</h1>

      {exams.length === 0 ? (
        <p className="text-gray-400">No exams available.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#1f1f1f] p-5 rounded-lg cursor-pointer hover:bg-[#2a2a2a]"
              onClick={() => navigate(`/exam/${exam.id}`)}
            >
              <h2 className="text-xl font-semibold">{exam.title}</h2>
              <p className="text-gray-400">{exam.description}</p>
              <p className="mt-2 text-sm">
                Duration: {exam.duration} mins | Marks: {exam.totalMarks}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
