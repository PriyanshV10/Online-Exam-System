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

      alert("Exam created Successfully");

      navigate(`/admin/exams/${res.data.data.examId}`);
    } catch {
      alert("Failed to create exam");
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center">
      <div className=" p-8 w-2/5 bg-[#282828] mx-auto rounded-2xl">
        <h1 className="text-2xl mb-4">Enter Exam Details</h1>

        <form action={submit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="block w-full mb-3 p-2 rounded-lg bg-[#404040]"
              placeholder="Enter Exam Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              className="block w-full mb-3 p-2 rounded-lg bg-[#404040]"
              placeholder="Enter Exam Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="number"
              className="block w-full mb-3 p-2 rounded-lg bg-[#404040]"
              placeholder="Enter Exam Duration (in minutes)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="marks">Marks</label>
            <input
              id="marks"
              type="number"
              className="block w-full mb-3 p-2 rounded-lg bg-[#404040]"
              placeholder="Enter Total Marks of the Exam"
              value={form.totalMarks}
              onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
              required
            />
          </div>

          <input type="submit" value="Add Exam" className="bg-blue-600 cursor-pointer mt-4 px-4 py-2 rounded-lg" />
        </form>
      </div>
    </div>
  );
}
