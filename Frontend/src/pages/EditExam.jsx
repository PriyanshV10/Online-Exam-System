import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { Plus, Search, X, Trash2, Edit2, PlayCircle, FolderOpen, Save, FileText, Clock, Trophy, ChevronRight, CheckCircle2, ArrowLeft, MoreVertical, LayoutList } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

export default function EditExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentTotalMarks, setCurrentTotalMarks] = useState(0);

  const [text, setText] = useState("");
  const [marks, setMarks] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correctOption, setCorrectOption] = useState("a");

  const [newQuestion, setNewQuestion] = useState(false);
  const [updateQuestion, setUpdateQuestion] = useState(false);

  const [editingQuestionId, setEditingQuestionId] = useState(null);

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
      setExam(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestion = async () => {
    try {
      const res = await api.get(`/admin/exams/${id}/questions`);
      setQuestions(res.data.data);

      let totalMarks = 0;
      res.data.data.forEach((q) => (totalMarks += q.marks));
      setCurrentTotalMarks(totalMarks);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.text.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchExam();
    fetchQuestion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const publishExam = () => {
    setConfirmModal({
      isOpen: true,
      title: "Publish Exam",
      message: "Are you sure you want to publish this exam? Students will be able to view and attempt it immediately.",
      isDangerous: false,
      onConfirm: async () => {
        try {
          await api.post(`/admin/exams/${id}/publish`);
          showToast("Exam published successfully");
          navigate("/", { replace: true });
        } catch (err) {
          showToast(err.response?.data?.message || "Publish failed", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const deleteExam = () => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Exam",
      message: "Are you sure you want to delete this exam? This action cannot be undone.",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/exams/${id}`);
          navigate("/", { replace: true });
        } catch (err) {
          showToast(err?.response?.data?.message || "Failed to delete exam", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const addOption = () => {
    const nextKey = String.fromCharCode(97 + Object.keys(options).length);
    setOptions({ ...options, [nextKey]: "" });
  };

  const removeOption = (keyToRemove) => {
    if (Object.keys(options).length <= 2) return;

    const filtered = Object.entries(options).filter(
      ([key]) => key !== keyToRemove
    );

    const normalized = {};
    filtered.forEach(([, value], idx) => {
      const key = String.fromCharCode(97 + idx);
      normalized[key] = value;
    });

    setOptions(normalized);

    // Fix correctOption if removed
    if (keyToRemove === correctOption) {
      setCorrectOption("a");
    }
  };

  const updateOption = (key, value) => {
    setOptions({ ...options, [key]: value });
  };

  const saveQuestion = async () => {
    if (!text.trim() || !marks || Object.keys(options).length < 2) {
      showToast("Fill all fields properly", "error");
      return;
    }

    const payload = {
      text,
      marks: Number(marks),
      options,
      correctOption,
    };

    try {
      if (updateQuestion && editingQuestionId) {
        // UPDATE
        await api.put(
          `/admin/exams/${id}/questions/${editingQuestionId}`,
          payload
        );
        showToast("Question updated successfully");
      } else {
        // ADD
        await api.post(`/admin/exams/${id}/questions`, payload);
        showToast("Question added successfully");
      }

      resetQuestionForm();
      fetchQuestion();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed", "error");
    }
  };

  const resetQuestionForm = () => {
    setText("");
    setMarks("");
    setOptions({ a: "", b: "", c: "", d: "" });
    setCorrectOption("a");
    setUpdateQuestion(false);
    setNewQuestion(false);
    setEditingQuestionId(null);
  };

  const editQuestion = (question) => {
    setText(question.text);
    setMarks(question.marks);

    const opts = {};
    let correct = "a";

    question.options.forEach((o) => {
      opts[o.label] = o.text;
      if (o.isCorrect) correct = o.label;
    });

    setOptions(opts);
    setCorrectOption(correct);

    setEditingQuestionId(question.id);
    setUpdateQuestion(true);
    setNewQuestion(true);
  };

  const deleteQuestion = (questionId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Question",
      message: "Are you sure you want to delete this question? This cannot be undone.",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await api.delete(`/admin/exams/${id}/questions/${questionId}`);
          showToast("Question deleted successfully");
          fetchQuestion();
        } catch (err) {
          showToast(err.response?.data?.message || "Failed", "error");
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
    <div className="min-h-screen pt-24 pb-12 px-6 w-full max-w-6xl mx-auto">
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

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex gap-3">
          <Link
            to={`/admin/exams/${id}/edit`}
            className="bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors dark:border-white/10"
          >
            <Edit2 size={16} /> Edit Details
          </Link>
          <button
            onClick={() => publishExam()}
            className="bg-green-100 hover:bg-green-200 text-green-700 border border-green-200 dark:bg-zinc-800 dark:hover:bg-green-500/20 dark:text-green-400 dark:hover:text-green-300 dark:border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <PlayCircle size={16} /> Publish Exam
          </button>
          <button
            className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 dark:bg-zinc-800 dark:hover:bg-red-500/20 dark:text-red-400 dark:hover:text-red-300 dark:border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            onClick={() => deleteExam()}
          >
            <Trash2 size={16} /> Delete Exam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Col: Exam Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl sticky top-28">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-900/20">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight line-clamp-2 text-slate-900 dark:text-white">{exam.title}</h1>
                <div className={`mt-2 inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${exam.status === "DRAFT" ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" : "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"}`}>
                  {exam.status}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 dark:bg-white/5 dark:border-white/5">
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Time Limit</p>
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Clock size={16} className="text-purple-600 dark:text-purple-400" />
                  {exam.duration} Minutes
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 dark:bg-white/5 dark:border-white/5">
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Total Marks</p>
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Trophy size={16} className="text-yellow-600 dark:text-yellow-400" />
                  {currentTotalMarks} / {exam.totalMarks}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 dark:bg-white/5 dark:border-white/5">
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Total Questions</p>
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <FolderOpen size={16} className="text-blue-600 dark:text-blue-400" />
                  {questions.length}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
              <p className="text-sm text-gray-500 italic">
                {exam.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Questions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <LayoutList className="text-purple-600 dark:text-purple-400" />
              Questions
            </h2>

            {!newQuestion && !updateQuestion && (
              <button
                onClick={() => {
                  resetQuestionForm();
                  setNewQuestion(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add Question
              </button>
            )}
          </div>

          {(newQuestion || updateQuestion) && (
            <div className="glass-card p-6 rounded-2xl animate-fade-in border border-purple-500/30">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                {updateQuestion ? <Edit2 size={20} /> : <Plus size={20} />}
                {updateQuestion ? "Update Question" : "Create New Question"}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-400 ml-1">Question Text</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter question here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-400 ml-1">Marks</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="1"
                      min="1"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-gray-400 ml-1">Answers Options</label>
                    <button onClick={addOption} className="text-xs font-bold text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1">
                      <Plus size={14} /> Add Option
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 dark:bg-zinc-900/50 rounded-xl p-4 space-y-3 dark:border-white/5">
                    {Object.entries(options).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 group">
                        <button
                          onClick={() => setCorrectOption(key)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${correctOption === key ? "bg-green-500 border-green-500 text-white" : "border-gray-400 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-400"}`}
                          title="Mark as correct"
                        >
                          {correctOption === key && <CheckCircle2 size={14} />}
                        </button>
                        <span className="text-sm font-bold text-gray-500 uppercase w-4 text-center">{key}</span>
                        <input
                          type="text"
                          className="flex-1 bg-transparent border-b border-gray-300 dark:border-white/10 focus:border-purple-500 outline-none py-1 text-sm text-slate-900 dark:text-white transition-colors placeholder:text-gray-400"
                          placeholder={`Option ${key.toUpperCase()} text`}
                          value={value}
                          onChange={(e) => updateOption(key, e.target.value)}
                        />
                        {Object.keys(options).length > 2 && (
                          <button onClick={() => removeOption(key)} className="text-gray-500 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/5 justify-end">
                  <button onClick={resetQuestionForm} className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors font-medium">
                    Cancel
                  </button>
                  <button onClick={saveQuestion} className="btn-primary px-6 py-2 flex items-center gap-2">
                    <Save size={18} />
                    {updateQuestion ? "Save Changes" : "Add Question"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!newQuestion && !updateQuestion && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full bg-white border border-gray-200 text-slate-900 placeholder-gray-400 dark:bg-zinc-900/80 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all dark:placeholder-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No questions found matching your search.
                  </div>
                ) : (
                  filteredQuestions.map((q, i) => (
                    <div key={q.id} className="glass-panel p-5 rounded-2xl group hover:border-purple-500/20 dark:hover:border-white/10 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-bold shrink-0">
                            {i + 1}
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-medium text-lg leading-snug text-slate-900 dark:text-white">{q.text}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                              {q.options.map((opt) => (
                                <div key={opt.label} className={`text-sm flex items-center gap-2 ${opt.isCorrect ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-500"}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${opt.isCorrect ? "bg-green-500" : "bg-gray-400 dark:bg-gray-700"}`} />
                                  {opt.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 dark:text-gray-500 dark:bg-zinc-900 dark:border-white/5 px-2 py-1 rounded">
                            {q.marks} Marks
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                editQuestion(q);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
