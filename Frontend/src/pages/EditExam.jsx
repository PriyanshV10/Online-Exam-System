import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { Plus, Search, X } from "lucide-react";

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

  const publishExam = async () => {
    try {
      await api.post(`/admin/exams/${id}/publish`);
      alert("Exam published");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Publish failed");
    }
  };

  const deleteExam = async () => {
    try {
      await api.delete(`/admin/exams/${id}`);
      alert("Exam deleted");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete exam");
    }
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
      alert("Fill all fields properly");
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
        alert("Question updated");
      } else {
        // ADD
        await api.post(`/admin/exams/${id}/questions`, payload);
        alert("Question added");
      }

      resetQuestionForm();
      fetchQuestion();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
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

  const deleteQuestion = async (questionId) => {
    try {
      await api.delete(`/admin/exams/${id}/questions/${questionId}`);
      alert("Question deleted");
      fetchQuestion();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen pb-8 bg-[#101010] text-white">
      <div className="container mx-auto p-2">
        {/* Exam Details */}
        <div className="bg-[#282828] w-3/4 mx-auto p-4 mt-8 rounded-2xl flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center">
              <img
                src="/assets/exam.png"
                alt="exam"
                className="h-20 w-20 p-1 rounded-full"
              />
            </div>

            <div>
              <h2 className="text-2xl font-medium">{exam.title}</h2>
              <div className="text-sm text-gray-300">
                {exam.description || "No Description"}
              </div>
              <div className="text-sm text-gray-300">
                {exam.duration} minutes
              </div>
              <div className="text-sm text-gray-300">
                Total Marks: {exam.totalMarks}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/admin/exams/${id}/edit`}
              className="px-3 py-2 bg-green-600 rounded-lg"
            >
              Edit
            </Link>
            <button
              onClick={() => publishExam()}
              className="bg-amber-600 px-3 py-2 rounded-lg"
            >
              Publish
            </button>
            <button
              className="bg-red-600 px-3 py-2 rounded-lg"
              onClick={() => deleteExam()}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Question Management */}
        <div className="mt-8 w-3/4 mx-auto bg-[#282828] rounded-xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#101010]">
              <h2 className="text-lg font-semibold">Question Management</h2>

              <div className="flex gap-3">
                <div className="flex align-center justify-between gap-2 border border-gray-400 rounded-lg p-2">
                  <Search className="mt-1 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    resetQuestionForm();
                    setNewQuestion(true);
                  }}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus />
                  Add New Question
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-[#101010] font-medium">
              Current Total Marks = {currentTotalMarks}
            </div>

            {(newQuestion || updateQuestion) && (
              <div className="p-4 border-b border-[#101010]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-1 flex items-center justify-center font-semibold text-blue-600">
                    <img src="/assets/question.png" alt="" />
                  </div>
                  <div className="flex w-full flex-col">
                    <h3 className="text-lg font-semibold">
                      {updateQuestion ? "Update Question" : "Add New Question"}
                    </h3>

                    <div className="flex flex-col gap-3 mt-4">
                      {/* Question text */}
                      <div className="flex flex-col gap-1">
                        <label>Question Text</label>
                        <input
                          type="text"
                          className="bg-[#404040] p-2 rounded-lg"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>

                      {/* Marks */}
                      <div className="flex flex-col gap-1">
                        <label>Question Marks</label>
                        <input
                          type="number"
                          className="bg-[#404040] p-2 rounded-lg"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                        />
                      </div>

                      {/* Options */}
                      <div className="flex flex-col gap-1">
                        <label>
                          Options{" "}
                          <span className="text-gray-300">
                            (Select the radio for correct answer)
                          </span>{" "}
                        </label>

                        {Object.entries(options).map(([key, value]) => (
                          <div key={key} className="flex gap-2 items-center">
                            <input
                              type="radio"
                              checked={correctOption === key}
                              onChange={() => setCorrectOption(key)}
                            />

                            <input
                              type="text"
                              className="bg-[#404040] w-full p-2 rounded-lg"
                              placeholder={`Option ${key.toUpperCase()}`}
                              value={value}
                              onChange={(e) =>
                                updateOption(key, e.target.value)
                              }
                            />

                            {Object.keys(options).length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(key)}
                              >
                                <X />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addOption}
                          className="mt-2 text-sm text-blue-400"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="flex gap-3 mt-3 w-full">
                        <button
                          onClick={() => saveQuestion()}
                          className="bg-blue-600 p-2 rounded-lg w-full"
                        >
                          {updateQuestion ? "Update Question" : "Add Question"}
                        </button>

                        <button
                          onClick={() => resetQuestionForm()}
                          className="bg-red-600 p-2 rounded-lg w-full"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="p-4 border-b border-[#101010] hover:bg-[#303030]"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full p-1 flex items-center justify-center font-semibold text-blue-600">
                      <img src="/assets/question.png" alt="" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{question.text}</h3>
                      {/* Options */}
                      <div className="flex flex-col gap-2 mt-3">
                        {question.options.map(({ label, text, isCorrect }) => (
                          <div key={label + text}>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isCorrect}
                                disabled
                              />
                              <span>{text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-2">
                    <div>Marks: {question.marks}</div>
                    <div className="flex gap-2 align-middle items-center">
                      <button
                        onClick={() => {
                          editQuestion(question);
                          window.scrollTo({ top: 200, behavior: "smooth" });
                        }}
                        className="bg-green-600 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 px-3 py-1 rounded-lg"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
