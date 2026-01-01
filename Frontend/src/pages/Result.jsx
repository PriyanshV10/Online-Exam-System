import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Calendar,
  BarChart3,
  Clock,
  ArrowLeft,
  Share2
} from "lucide-react";

export default function Result() {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResult = async () => {
    try {
      const res = await api.get(`/attempts/${id}/result`);
      setResult(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

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
        <div className="glass-panel text-red-400 p-6 rounded-xl border border-red-500/20 flex items-center gap-3">
          <XCircle size={24} />
          {error}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const totalQuestions = result.length || result.questions?.length || 0;

  const correctAnswersCount =
    result.questions?.filter((q) => {
      const selected = q.options.find(
        (opt) => opt.optionId === q.selectedOption
      );
      return selected?.isCorrect;
    }).length || 0;

  const percentage = result.percentage || 0;
  const isPass = percentage >= 40; // Passing Marks

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 w-full max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {result.examTitle || "Exam Result"}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span className="flex items-center gap-1.5 bg-white border border-gray-200 dark:bg-white/5 dark:border-0 px-3 py-1 rounded-full">
              <Calendar size={14} />{" "}
              {new Date(result.submittedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 bg-white border border-gray-200 dark:bg-white/5 dark:border-0 px-3 py-1 rounded-full">
              <Clock size={14} />{" "}
              {new Date(result.submittedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-6 py-2 rounded-xl font-bold text-sm border flex items-center gap-2 ${isPass
              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
              : "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
              }`}
          >
            {isPass ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {isPass ? "PASSED" : "NEEDS IMPROVEMENT"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in delay-100">
        {/* Score Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500 rounded-xl">
                <Trophy size={24} />
              </div>
              <span className="text-xs font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-500 dark:text-gray-400">SCORE</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
              {result.score}
              <span className="text-lg text-gray-500 font-medium ml-2">
                / {result.totalMarks}
              </span>
            </div>
          </div>
        </div>

        {/* Percentage Progress Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between">
            <div className="relative z-10">
              <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                Performance
              </div>
              <div className={`text-4xl font-bold ${isPass ? "text-green-600 dark:text-green-400" : "text-orange-500 dark:text-orange-400"}`}>
                {percentage.toFixed(2)}%
              </div>
            </div>

            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-white/5"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={`${isPass ? "text-green-500" : "text-orange-500"} transition-all duration-1000 ease-out`}
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Correct Answers Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <span className="text-xs font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-500 dark:text-gray-400">ACCURACY</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
              {correctAnswersCount}
              <span className="text-lg text-gray-500 font-medium ml-2">/ {totalQuestions}</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(correctAnswersCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Time Taken Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-500 rounded-xl">
                <Clock size={24} />
              </div>
              <span className="text-xs font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-500 dark:text-gray-400">TIME</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {(() => {
                if (!result.startedAt || !result.submittedAt) return <span className="text-gray-400 text-2xl">N/A</span>;
                const start = new Date(result.startedAt).getTime();
                const end = new Date(result.submittedAt).getTime();

                const examDurationMs = (result.examDuration || 0) * 60000;
                const actualEnd = examDurationMs > 0 ? Math.min(end, start + examDurationMs) : end;

                const diffMs = actualEnd - start;
                if (diffMs < 0) return <span className="text-gray-400 text-2xl">N/A</span>;
                const minutes = Math.floor(diffMs / 60000);
                const seconds = Math.floor((diffMs % 60000) / 1000);
                return (
                  <>
                    {minutes}<span className="text-lg text-gray-500 ml-1 mr-2">m</span>
                    {seconds}<span className="text-lg text-gray-500 ml-1">s</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review Section */}
      <div className="glass-panel p-8 rounded-2xl animate-fade-in delay-200">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-purple-600 dark:text-purple-500" />
          Detailed Analysis
        </h2>

        <div className="space-y-4">
          {result.questions.map((q, index) => {
            const selectedOpt = q.options.find(
              (o) => o.optionId === q.selectedOption
            );
            const isCorrect = selectedOpt?.isCorrect;

            return (
              <div
                key={q.questionId || index}
                className="bg-gray-50 border border-gray-200 dark:bg-zinc-900/50 rounded-xl p-6 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-white border-gray-200 text-gray-500 dark:bg-white/5 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md border dark:border-white/10 font-medium">
                        Q{index + 1}
                      </span>
                      <span className="bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 text-xs px-2.5 py-1 rounded-md border dark:border-amber-500/20 font-medium">
                        {q.questionMarks} Marks
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white leading-relaxed">
                      {q.questionText}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-green-700 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-500/10 px-4 py-1.5 rounded-full text-xs font-bold border dark:border-green-500/20">
                        <CheckCircle size={14} /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-700 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/10 px-4 py-1.5 rounded-full text-xs font-bold border dark:border-red-500/20">
                        <XCircle size={14} /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = opt.optionId === q.selectedOption;
                    const isOptCorrect = opt.isCorrect;

                    let itemStyle =
                      "border-gray-200 bg-white text-gray-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-400"; // Default

                    if (isSelected && isOptCorrect) {
                      itemStyle =
                        "bg-green-100 border-green-300 text-green-700 dark:bg-green-500/20 dark:border-green-500 dark:text-white dark:shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                    } else if (isSelected && !isOptCorrect) {
                      itemStyle =
                        "bg-red-100 border-red-300 text-red-700 dark:bg-red-500/20 dark:border-red-500 dark:text-white dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                    } else if (!isSelected && isOptCorrect) {
                      itemStyle =
                        "bg-green-50 border-green-200 text-green-600 border-dashed ring-1 ring-green-500/20 dark:bg-green-500/10 dark:border-green-500/50 dark:text-green-300";
                    }

                    return (
                      <div
                        key={opt.optionId}
                        className={`p-4 rounded-xl border ${itemStyle} transition-all relative flex items-center justify-between group`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected || isOptCorrect
                              ? "border-current"
                              : "border-gray-300 text-gray-400 group-hover:border-gray-400 dark:border-gray-600 dark:group-hover:border-gray-500"
                              }`}
                          >
                            {opt.optionLabel.toUpperCase()}
                          </span>
                          <span className="font-medium">{opt.optionText}</span>
                        </div>
                        {isSelected &&
                          (isOptCorrect ? (
                            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle size={18} className="text-red-600 dark:text-red-400" />
                          ))}
                        {!isSelected && isOptCorrect && (
                          <CheckCircle size={18} className="text-green-500/70" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
