import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/api";
import { FileText, Clock, Trophy, ArrowLeft, AlignLeft, CheckCircle, Save, Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

export default function UpdateExam() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
  });

  // UI State
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isDangerous: false
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/admin/exams/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put(`/admin/exams/${id}`, {
        ...form,
        duration: Number(form.duration),
        totalMarks: Number(form.totalMarks),
      });

      // Navigate back to the exam management page
      navigate(`/admin/exams/${res.data.data.examId}`);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update exam", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Exam",
      message: "Are you sure you want to delete this exam? This action cannot be undone.",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/exams/${id}`);
          navigate("/");
        } catch (err) {
          showToast(err?.response?.data?.message || "Failed to delete exam", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-400 text-lg">{error}</div>
        <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 w-full max-w-3xl mx-auto">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDangerous={confirmModal.isDangerous}
      />

      <Link to={`/admin/exams/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Exam
      </Link>

      <div className="glass-card p-8 rounded-2xl animate-fade-in relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <Edit2 size={24} />
              </div>
              Edit Exam Details
            </h1>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors"
              title="Delete Exam"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-8 mt-2">Update the configuration for this assessment.</p>

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

            <div className="pt-4 flex justify-end gap-3">
              <Link to={`/admin/exams/${id}`} className="px-6 py-2 rounded-xl text-gray-400 hover:bg-white/5 transition-colors font-medium">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Update Exam
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
