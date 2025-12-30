import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Calendar,
  BarChart3,
  Clock,
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
      console.log(res.data.data);
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
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-red-500">
        <div className="bg-[#282828] p-6 rounded-lg shadow-lg flex items-center gap-3">
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
    <div className="min-h-screen bg-[#101010] text-gray-200 p-6 md:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {result.examTitle || "Exam Result"}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(result.submittedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />{" "}
                {new Date(result.submittedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full font-semibold text-sm border ${isPass
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
          >
            {isPass ? "Passed" : "Needs Improvement"}
          </div>
        </header>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Score Card */}
          <div className="bg-[#282828] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trophy size={40} className="text-yellow-500 mb-3" />
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Score
            </span>
            <div className="text-4xl font-bold text-white mt-1">
              {result.score}{" "}
              <span className="text-lg text-gray-500">
                / {result.totalMarks}
              </span>
            </div>
          </div>

          {/* Percentage Progress Card */}
          <div className="bg-[#282828] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">
              Performance
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Circular Progress */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={`${isPass ? "text-green-500" : "text-orange-500"
                    } transition-all duration-1000 ease-out`}
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Time & Correct Card */}
          <div className="bg-[#282828] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <BarChart3 size={40} className="text-blue-500 mb-3" />
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Correct Answers
            </span>
            <div className="text-4xl font-bold text-white mt-1">
              {correctAnswersCount}{" "}
              <span className="text-lg text-gray-500">/ {totalQuestions}</span>
            </div>
          </div>

          {/* Time Taken Card */}
          <div className="bg-[#282828] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Clock size={40} className="text-purple-500 mb-3" />
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Time Taken
            </span>
            <div className="text-3xl font-bold text-white mt-1">
              {(() => {
                if (!result.startedAt || !result.submittedAt) return <span className="text-gray-500 text-2xl">N/A</span>;
                const start = new Date(result.startedAt).getTime();
                const end = new Date(result.submittedAt).getTime();

                const examDurationMs = (result.examDuration || 0) * 60000;
                const actualEnd = examDurationMs > 0 ? Math.min(end, start + examDurationMs) : end;
                
                const diffMs = actualEnd - start;
                if (diffMs < 0) return <span className="text-gray-500 text-2xl">N/A</span>;
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

        {/* Questions Review Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white pl-2 border-l-4 border-purple-500">
            Detailed Review
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
                  className="bg-[#282828] rounded-xl p-6 border border-white/5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded border border-white/10">
                          Marks: {q.questionMarks}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        <span className="text-gray-500 mr-2">{index + 1}.</span>
                        {q.questionText}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-500/20">
                          <CheckCircle size={14} /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-red-500/20">
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
                        "border-white/10 hover:bg-white/5 text-gray-400"; // Default

                      if (isSelected && isOptCorrect) {
                        itemStyle =
                          "bg-green-500/10 border-green-500/50 text-green-400";
                      } else if (isSelected && !isOptCorrect) {
                        itemStyle =
                          "bg-red-500/10 border-red-500/50 text-red-400";
                      } else if (!isSelected && isOptCorrect) {
                        itemStyle =
                          "bg-green-500/5 border-green-500/30 text-green-300/70 border-dashed";
                      }

                      return (
                        <div
                          key={opt.optionId}
                          className={`p-4 rounded-lg border ${itemStyle} transition-all relative flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${isSelected || isOptCorrect
                                ? "border-current"
                                : "border-gray-600"
                                }`}
                            >
                              {opt.optionLabel.toUpperCase()}
                            </span>
                            <span>{opt.optionText}</span>
                          </div>
                          {isSelected &&
                            (isOptCorrect ? (
                              <CheckCircle size={18} />
                            ) : (
                              <XCircle size={18} />
                            ))}
                          {!isSelected && isOptCorrect && (
                            <CheckCircle size={18} className="opacity-50" />
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
    </div>
  );
}
