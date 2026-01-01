import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { Search, Filter, Clock, FileText, Award, ChevronLeft, ChevronRight, PlayCircle, BarChart2 } from "lucide-react";

export default function ExamList({ refreshStats }) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExams = async () => {
    try {
      const res = await api.get("/exams");
      setExams(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await api.get("/results");
      setResults(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter((e) => {
    const matchStatus =
      statusFilter === "All" ||
      e.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredExams.length / PAGE_SIZE);

  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    fetchExams();
    fetchResults();
    refreshStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl animate-fade-in delay-300 bg-white dark:bg-zinc-900 border-gray-200 dark:border-white/5">
      {/* Header with Search and Filter */}
      <div className="p-6 border-b border-gray-200 dark:border-white/5 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-gray-50/50 dark:bg-white/5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="text-purple-600 dark:text-purple-500" />
          Available Exams
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search exams..."
              className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-8 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="NOT ATTEMPTED">Not Attempted</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="ATTEMPTING">Attempting</option>
            </select>
          </div>
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          <p>No exams found available for you.</p>
        </div>
      ) : (
        <div>
          {paginatedExams.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <p>No exams match your search filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {paginatedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center border border-indigo-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Award className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl">
                        {exam.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                          <Clock size={14} /> {exam.duration} mins
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                          <Award size={14} /> {exam.totalMarks} Marks
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md">
                          <FileText size={14} /> {exam.totalQuestions} Qs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${exam.status === "ATTEMPTED"
                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                      : exam.status === "ATTEMPTING"
                        ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                      }`}>
                      {exam.status.replace("_", " ")}
                    </div>

                    {exam.status !== "ATTEMPTED" && (
                      <Link
                        to={`/exam/${exam.id}`}
                        className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
                      >
                        {exam.status === "NOT ATTEMPTED" ? (
                          <><span>Start</span> <PlayCircle size={16} /></>
                        ) : (
                          <><span>Resume</span> <PlayCircle size={16} /></>
                        )}
                      </Link>
                    )}

                    {exam.status === "ATTEMPTED" && (() => {
                      const result = results.find((r) => r.examId === exam.id);
                      return result ? (
                        <Link
                          to={`/attempts/${result.attemptId}/result`}
                          className="btn-secondary py-2 px-5 text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10"
                        >
                          <span>Results</span> <BarChart2 size={16} />
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="text-slate-900 dark:text-white font-medium">{PAGE_SIZE * (currentPage - 1) + 1}</span>-
                <span className="text-slate-900 dark:text-white font-medium">{Math.min(PAGE_SIZE * currentPage, filteredExams.length)}</span> of{" "}
                <span className="text-slate-900 dark:text-white font-medium">{filteredExams.length}</span> exams
              </span>

              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
