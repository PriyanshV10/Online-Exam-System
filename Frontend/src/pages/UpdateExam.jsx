import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function UpdateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exam, setExam] = useState({});

  const fetchExam = async () => {
    try {
      const res = await api.get(`/admin/exams/${id}`);
      setExam(res.data.data);
      setForm(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
  }, []);

  const submit = async () => {
    try {
      const res = await api.put(`/admin/exams/${id}`, {
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
      });

      alert("Exam updated Successfully");

      navigate(`/admin/exams/${res.data.data.examId}`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update exam");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#101010] min-h-screen text-center  text-white p-8">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center">
      <div className=" p-8 w-2/5 bg-[#282828] mx-auto rounded-2xl">
        <h1 className="text-2xl mb-4">Edit Exam Details</h1>

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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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

          <input
            type="submit"
            value="Update Exam"
            className="bg-blue-600 cursor-pointer mt-4 px-4 py-2 rounded-lg"
          />
        </form>
      </div>
    </div>
  );
}
