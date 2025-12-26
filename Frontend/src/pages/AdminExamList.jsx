import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AdminExamList() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const loadExams = () => {
    api.get("/admin/exams").then(res => setExams(res.data.data));
  };

  useEffect(() => {
    loadExams();
  }, []);

  const publishExam = async (id) => {
    try {
      await api.post(`/admin/exams/${id}/publish`);
      alert("Exam published");
      loadExams();
    } catch (err) {
      alert(err.response?.data?.error || "Publish failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Exams</h1>

      <button
        onClick={() => navigate("/admin/exams/create")}
        className="mb-6 bg-blue-600 px-4 py-2 rounded"
      >
        + Create Exam
      </button>

      {exams.map(exam => (
        <div key={exam.id} className="bg-[#1f1f1f] p-4 mb-3 rounded">
          <h2 className="text-xl">{exam.title}</h2>
          <p>Status: {exam.status}</p>

          <div className="mt-3 flex gap-3">
            <button
              onClick={() => navigate(`/admin/exams/${exam.id}`)}
              className="bg-gray-600 px-3 py-1 rounded"
            >
              Manage
            </button>

            {exam.status === "DRAFT" && (
              <button
                onClick={() => publishExam(exam.id)}
                className="bg-green-600 px-3 py-1 rounded"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
