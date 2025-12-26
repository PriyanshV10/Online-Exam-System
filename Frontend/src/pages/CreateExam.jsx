import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function CreateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
  });

  const submit = async () => {
    try {
      const res = await api.post("/admin/exams", {
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
      });

      navigate(`/admin/exams/${res.data.data.examId}`);
    } catch {
      alert("Failed to create exam");
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8 max-w-xl">
      <h1 className="text-2xl mb-4">Create Exam</h1>

      {["title", "description", "duration", "totalMarks"].map(key => (
        <input
          key={key}
          placeholder={key}
          className="block w-full mb-3 p-2 bg-[#1f1f1f]"
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button
        onClick={submit}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}
