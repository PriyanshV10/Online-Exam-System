import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

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
      alert(err?.response?.data?.message || "Failed to fetch attempt");
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
          handleSubmitExam(); // auto-submit on frontend
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
      alert("Submitted");
      navigate(`/attempts/${attemptId}/result`);
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
      alert(err?.response?.data?.message || "Failed to submit question");
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

  const handleSubmitExam = async () => {
    if (currentQuestion && selectedOptionId != null) {
      await submitQuestion(currentQuestion.questionId, selectedOptionId);
    }

    try {
      await api.post(`/attempts/${attemptId}/submit`);
      setIsSubmitted(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit exam");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        {error}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#101010] text-white p-8 flex ">
      <div className="w-full h-full pr-6">
        {currentQuestion && (
          <div className="h-full bg-[#282828] p-8 rounded-2xl flex flex-col gap-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="text-gray-400 font-medium text-lg">
                  Question {currentQuestionIndex + 1}
                </div>

                <div className="bg-amber-100 text-amber-600 px-3 py-1 rounded-2xl font-medium text-sm">
                  Marks: {currentQuestion.questionMarks}
                </div>
              </div>

              {/* Question text */}
              <h2 className="text-lg font-semibold mb-4">
                Q. {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.optionId}
                  onClick={() => handleOptionSelect(opt.optionId)}
                  className={`w-[98%] text-left px-4 py-2 rounded-lg border ${
                    opt.optionId === selectedOptionId ? "bg-amber-600" : ""
                  } "border-gray-600"`}
                >
                  <span className="mr-2 font-semibold">{opt.optionLabel}.</span>
                  {opt.optionText}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-white text-black rounded-2xl font-medium disabled:opacity-50"
                disabled={currentQuestionIndex === 0}
                onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-2xl font-medium disabled:opacity-50"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-full bg-[#282828] w-2/5 p-8 rounded-2xl flex flex-col gap-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-lg text-gray-400 font-medium">
              {exam?.title}
            </div>
            <div className="text-green-600 bg-green-100 px-4 py-2 rounded-2xl font-medium text-lg">
              {formatTime(remainingSeconds)}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isActive = index === currentQuestionIndex;
            const isAnswered = q.selectedOption != null;

            return (
              <button
                key={q.questionId}
                onClick={() => handleQuestionChange(index)}
                className={`
          w-14 h-14 flex items-center justify-center border rounded-full text-lg font-medium
          ${isActive ? "bg-blue-600 text-white" : ""}
          ${!isActive && isAnswered ? "bg-green-400 text-black" : ""}
          ${!isActive && !isAnswered ? "bg-white text-black" : ""}
        `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 w-full bg-blue-600 text-white rounded-2xl font-medium disabled:opacity-50"
            onClick={() => handleSubmitExam()}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
