import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, Search, Filter, FileText, Clock, Trophy, Edit2, PlayCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

const ExamManagement = ({ refreshStats }) => {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchExams = async () => {
    try {
      const res = await api.get("/admin/exams");
      setExams(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const filterExams = () => {
    return exams.filter((e) => {
      const matchStatus =
        statusFilter === "All" ||
        e.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  };

  const filteredExams = filterExams();

  const publishExam = (examId) => {
    setConfirmModal({
      isOpen: true,
      title: "Publish Exam",
      message: "Are you sure you want to publish this exam? Students will be able to view and attempt it immediately.",
      isDangerous: false,
      onConfirm: async () => {
        try {
          await api.post(`/admin/exams/${examId}/publish`);
          showToast("Exam published successfully");
          fetchExams();
          refreshStats();
        } catch (err) {
          showToast(err?.response?.data?.message || "Failed to publish exam", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const deleteExam = (examId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Exam",
      message: "Are you sure you want to delete this exam? This action cannot be undone.",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/exams/${examId}`);
          showToast("Exam deleted successfully");
          fetchExams();
          refreshStats();
        } catch (err) {
          showToast(err?.response?.data?.message || "Failed to delete exam", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE);

  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    fetchExams();
  }, []);

  // Reset currentPage to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }

  return (
    <div className="mt-8">
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search exams..."
              className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <Link
          to="/admin/exams/create"
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          Create Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
          <FileText size={48} className="mx-auto mb-3 opacity-20" />
          <p>No exams created yet. Click "Create Exam" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="">
            <div className="space-y-4">
              {paginatedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-purple-500/30 transition-all bg-white dark:bg-zinc-900/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-gray-200 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{exam.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{exam.description || "No description provided."}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                          <Clock size={14} /> {exam.duration} mins
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                          <Trophy size={14} /> {exam.totalMarks} Marks
                        </span>
                        <span className={`px-2 py-1 rounded border ${exam.status === "DRAFT"
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          : "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                          }`}>
                          {exam.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {exam.status === "DRAFT" && (
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-white/5 justify-end">
                      <Link
                        to={`/admin/exams/${exam.id}`}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 transition-colors tooltip"
                        title="Edit Exam"
                      >
                        <Edit2 size={18} />
                      </Link>

                      <button
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 transition-colors"
                        onClick={() => publishExam(exam.id)}
                        title="Publish Exam"
                      >
                        <PlayCircle size={18} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors"
                        onClick={() => deleteExam(exam.id)}
                        title="Delete Exam"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              <div className="px-6 py-4 mt-4 flex items-center justify-between bg-white border border-gray-200 dark:bg-zinc-900/50 dark:border-0 rounded-xl">
                <span className="text-sm text-gray-500">
                  Showing <span className="text-slate-900 dark:text-white font-medium">{Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredExams.length)}</span> to <span className="text-slate-900 dark:text-white font-medium">{Math.min(currentPage * PAGE_SIZE, filteredExams.length)}</span> of <span className="text-slate-900 dark:text-white font-medium">{filteredExams.length}</span> exams
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
