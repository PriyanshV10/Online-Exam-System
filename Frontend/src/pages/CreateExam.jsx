import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { FileText, Clock, Trophy, ArrowLeft, AlignLeft, CheckCircle } from "lucide-react";
import Toast from "../components/Toast";

export default function CreateExam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/exams", {
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
      });

      // Show success feedback
      showToast("Exam created successfully!");

      // Delay navigation slightly to let user see success
      setTimeout(() => {
        navigate(`/admin/exams/${res.data.data.examId}`);
      }, 1000);

    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to create exam", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 w-full max-w-3xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass-card p-8 rounded-2xl animate-fade-in relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FileText size={24} />
            </div>
            Create New Exam
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Set up the details for a new assessment.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Exam Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  className="input-field !pl-12"
                  placeholder="e.g. Final Semester Physics"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3 text-gray-400 dark:text-gray-500" size={18} />
                <textarea
                  className="input-field !pl-12 min-h-[100px] resize-none"
                  placeholder="Enter a brief description of the exam topics..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Duration (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    type="number"
                    className="input-field !pl-12"
                    placeholder="60"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 ml-1">Total Marks</label>
                <div className="relative">
                  <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    type="number"
                    className="input-field !pl-12"
                    placeholder="100"
                    value={form.totalMarks}
                    onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Create Exam
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
