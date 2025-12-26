import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ExamAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Start exam
  useEffect(() => {
    api
      .post(`/exams/${id}/start`)
      .then((res) => {
        setAttemptId(res.data.data.attemptId);
        setQuestions(res.data.data.questions);
      })
      .catch(() => {
        alert("Failed to start exam");
        navigate("/exams");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const saveAnswer = async (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });

    await api.post(`/attempts/${attemptId}/answer`, {
      questionId,
      optionId,
    });
  };

  const submitExam = async () => {
    if (!window.confirm("Submit exam?")) return;

    try {
      const res = await api.post(`/exams/${id}/submit`, {
        attemptId,
      });

      alert(`Exam submitted! Score: ${res.data.data.score}`);
      navigate("/results");
    } catch {
      alert("Failed to submit exam");
    }
  };

  if (loading) {
    return <div className="text-white p-8">Starting exam...</div>;
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Exam</h1>

      {questions.map((q, index) => (
        <div key={q.id} className="mb-6 bg-[#1f1f1f] p-4 rounded">
          <p className="font-semibold mb-2">
            {index + 1}. {q.text}
          </p>

          {q.options.map((opt) => (
            <label
              key={opt.id}
              className="block cursor-pointer mb-1"
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt.id}
                onChange={() => saveAnswer(q.id, opt.id)}
                className="mr-2"
              />
              {opt.label}. {opt.text}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submitExam}
        className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
      >
        Submit Exam
      </button>
    </div>
  );
}
