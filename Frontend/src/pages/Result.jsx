import { useEffect, useState } from "react";
import api from "../api/api";

export default function Result() {
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .get("/results")
      .then((res) => setResults(res.data.data))
      .catch(() => alert("Failed to load results"));
  }, []);

  const viewDetails = async (attemptId) => {
    const res = await api.get(`/results/${attemptId}`);
    setSelected(res.data.data);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Results</h1>

      {results.length === 0 ? (
        <p>No results yet.</p>
      ) : (
        <ul className="mb-8">
          {results.map((r) => (
            <li
              key={r.attemptId}
              className="cursor-pointer p-3 bg-[#1f1f1f] mb-2 rounded hover:bg-[#2a2a2a]"
              onClick={() => viewDetails(r.attemptId)}
            >
              Exam #{r.examId} | Score: {r.score} | Time:{" "}
              {r.durationMinutes} mins
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div className="bg-[#1f1f1f] p-5 rounded">
          <h2 className="text-xl font-semibold mb-4">Details</h2>

          {selected.answers.map((a, i) => (
            <div key={i} className="mb-2">
              <p>{a.question}</p>
              <p
                className={
                  a.correct ? "text-green-400" : "text-red-400"
                }
              >
                Your answer: {a.selectedOption}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
