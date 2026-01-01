import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";

export default function ExamAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attemptId, setAttemptId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

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
      const res = await api.get(`/exams/${id}`);
      setExam(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exam");
    } finally {
      setLoading(false);
    }
  };

  const attemptExam = async () => {
    try {
      const res = await api.post(`/exams/${id}/attempt`);
      const aid = res.data.data.attemptId;

      setAttemptId(aid);
      fetchAttempt(aid);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to attempt exam");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempt = async (aid) => {
    try {
      const res = await api.get(`/attempts/${aid}`);
      const data = res.data.data;
      const firstQuestion = data.questions[0];

      setIsSubmitted(data.isSubmitted);
      setQuestions(data.questions);
      setStartedAt(data.startedAt);
      setCurrentQuestion(firstQuestion);
      setCurrentQuestionIndex(0);
      setStartedAt(data.startedAt);

      if (firstQuestion.selectedOption != null) {
        setSelectedOptionId(firstQuestion.selectedOption);
      } else {
        setSelectedOptionId(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch attempt");
    }
  };

  const calculateRemainingSeconds = () => {
    if (!startedAt || !exam) return 0;

    const start = new Date(startedAt).getTime();
    const durationMs = exam.duration * 60 * 1000;
    const end = start + durationMs;

    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  };

  useEffect(() => {
    if (!startedAt || !exam) return;

    // initialize immediately
    setRemainingSeconds(calculateRemainingSeconds());

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam(true); // auto-submit on frontend
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, exam]);

  useEffect(() => {
    attemptExam();
  }, [id]);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (isSubmitted && attemptId) {
      showToast("Exam submitted successfully!");
      // Delay navigation slightly to ensure user sees toast or just navigate immediately
      setTimeout(() => {
        navigate(`/attempts/${attemptId}/result`);
      }, 2000)
    }
  }, [isSubmitted, attemptId]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      const hh = hours.toString().padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }

    return `${mm}:${ss}`;
  };

  const submitQuestion = async (questionId, optionId) => {
    if (optionId == null) {
      return;
    }

    try {
      await api.post(`/attempts/${attemptId}/answer`, {
        questionId,
        optionId,
      });

      setQuestions((prev) =>
        prev.map((q) =>
          q.questionId === questionId ? { ...q, selectedOption: optionId } : q
        )
      );
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit question", "error");
    }
  };

  const handleQuestionChange = async (index) => {
    if (currentQuestion && selectedOptionId != null) {
      await submitQuestion(currentQuestion.questionId, selectedOptionId);
    }

    const nextQuestion = questions[index];
    setCurrentQuestion(nextQuestion);
    setCurrentQuestionIndex(index);

    setSelectedOptionId(nextQuestion.selectedOption ?? null);
  };

  const handleOptionSelect = (optionId) => {
    if (selectedOptionId === optionId) {
      setSelectedOptionId(null);
      return;
    }
    setSelectedOptionId(optionId);
  };

  const handleSubmitExam = async (force = false) => {
    if (currentQuestion && selectedOptionId != null) {
      await submitQuestion(currentQuestion.questionId, selectedOptionId);
    }

    const submit = async () => {
      try {
        await api.post(`/attempts/${attemptId}/submit`);
        setIsSubmitted(true);
      } catch (err) {
        showToast(err?.response?.data?.message || "Failed to submit exam", "error");
      }
    };

    if (force) {
      submit();
    } else {
      setConfirmModal({
        isOpen: true,
        title: "Submit Exam",
        message: "Are you sure you want to finish and submit this exam? You cannot undo this action.",
        isDangerous: true,
        onConfirm: async () => {
          await submit();
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass-panel text-red-400 p-6 rounded-xl border border-red-500/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-6 flex flex-col md:flex-row gap-6 max-w-[1600px] mx-auto">
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

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {currentQuestion && (
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6 h-full shadow-2xl animate-fade-in relative overflow-hidden bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/5">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="text-gray-500 dark:text-gray-400 font-medium text-lg flex items-center gap-2">
                  <HelpCircle size={20} className="text-purple-600 dark:text-purple-500" />
                  Question {currentQuestionIndex + 1}
                </div>

                <div className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1.5 border">
                  <AlertCircle size={14} />
                  Marks: {currentQuestion.questionMarks}
                </div>
              </div>

              {/* Question text */}
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-slate-900 dark:text-white">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mt-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.optionId}
                  onClick={() => handleOptionSelect(opt.optionId)}
                  className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 group relative overflow-hidden flex items-center gap-4 ${opt.optionId === selectedOptionId
                    ? "bg-purple-50 border-purple-500 text-purple-900 dark:bg-purple-600/20 dark:text-white"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:border-white/20"
                    }`}
                >
                  {opt.optionId === selectedOptionId && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                  )}

                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${opt.optionId === selectedOptionId
                    ? "bg-purple-500 border-purple-500 text-white"
                    : "border-gray-300 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-500 dark:border-gray-600 dark:text-gray-500 dark:group-hover:border-gray-400 dark:group-hover:text-gray-400"
                    }`}>
                    {opt.optionLabel}
                  </span>

                  <span className="font-medium text-lg">{opt.optionText}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-white/5 mt-auto">
              <button
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentQuestionIndex === 0}
                onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <button
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar: Navigation & Timer */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6 h-fit md:h-[calc(100vh-120px)] sticky top-24">
        {/* Timer Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border-b-4 border-b-blue-500 shadow-xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Time Remaining</span>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums tracking-widest">
              {formatTime(remainingSeconds)}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${remainingSeconds < 300 ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 animate-pulse' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
            <Clock size={24} />
          </div>
        </div>

        {/* Question Palette */}
        <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col gap-4 shadow-xl overflow-hidden bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full" />
              Question Palette
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{questions.length} Questions</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 grid grid-cols-5 gap-2 content-start">
            {questions.map((q, index) => {
              const isActive = index === currentQuestionIndex;
              const isAnswered = q.selectedOption != null;

              return (
                <button
                  key={q.questionId}
                  onClick={() => handleQuestionChange(index)}
                  className={`
                    w-full aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 border
                    ${isActive
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105"
                      : isAnswered
                        ? "bg-green-100 border-green-200 text-green-700 hover:bg-green-200 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-green-500/20"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:border-white/20"}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-3 h-3 rounded bg-purple-600"></div> Current
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200 dark:bg-green-500/20 dark:border-green-500/50"></div> Answered
              <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10"></div> Unanswered
            </div>

            <button
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              onClick={() => handleSubmitExam()}
            >
              <CheckCircle size={18} />
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
