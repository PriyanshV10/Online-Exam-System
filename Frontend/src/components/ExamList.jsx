import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Plus, Search } from "lucide-react";

export default function ExamList({ refreshStats }) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [exams, setExams] = useState([]);
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
    refreshStats();
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="mt-8 bg-[#282828] rounded-xl">
      {exams.length === 0 ? (
        <p className="text-gray-400">No exams found.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#101010]">
            <h2 className="text-lg font-semibold">Exam Management</h2>

            <div className="flex gap-3">
              <div className="flex align-center justify-between gap-2 border border-gray-400 rounded-lg p-2">
                <Search className="mt-1 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  className="focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="border border-gray-400 rounded-lg px-4 py-2 text-sm bg-[#282828] focus:outline-none"
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

          {paginatedExams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 border-b border-[#101010] hover:bg-[#303030]"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-1 flex items-center justify-center font-semibold text-blue-600">
                    <img src="/assets/exam.png" alt="" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{exam.title}</h3>
                    <p className="text-sm text-gray-300">
                      {exam.description?.slice(0, 50) || "No description"}
                    </p>
                    <div className="text-sm text-gray-300">
                      {exam.duration} minutes
                    </div>
                    <div className="text-sm text-gray-300">
                      Total Marks: {exam.totalMarks}
                    </div>
                    <div className="text-sm text-gray-300">
                      No. of Questions {exam.totalQuestions}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end gap-2">
                  <div
                    className={`font-medium text-sm px-3 py-1 rounded-full  ${
                      exam.status === "ATTEMPTED"
                        ? "text-amber-600 bg-amber-100"
                        : "text-green-600 bg-green-100"
                    }`}
                  >
                    {exam.status[0] + exam.status.slice(1).toLowerCase()}
                  </div>

                  {exam.status !== "ATTEMPTED"&& (
                    <div className="flex gap-2 align-middle items-center">
                      <Link
                        to={`/exam/${exam.id}`}
                        className="bg-blue-600 px-3 py-1 rounded-lg"
                      >
                        {exam.status === "NOT ATTEMPTED" ? "Start" : "Resume"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center p-4  text-sm">
            <span>
              Showing {PAGE_SIZE * (currentPage - 1) + 1}-
              {Math.min(PAGE_SIZE * currentPage, paginatedExams.length)} of{" "}
              {filteredExams.length} exams
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              <button
                className="px-3 py-1 border rounded-lg bg-blue-600 text-white disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
