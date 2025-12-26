import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function ManageExam() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [marks, setMarks] = useState("");
  const [options, setOptions] = useState({ a:"", b:"", c:"", d:"" });
  const [correctOption, setCorrectOption] = useState("a");

  const loadQuestions = () => {
    api.get(`/admin/exams/${id}/questions`)
       .then(res => setQuestions(res.data.data));
  };

  useEffect(() => {
    loadQuestions();
  }, [id]);

  const addQuestion = async () => {
    try {
      await api.post(`/admin/exams/${id}/questions`, {
        text,
        marks: Number(marks),
        options,
        correctOption
      });

      setText("");
      setMarks("");
      setOptions({ a:"", b:"", c:"", d:"" });
      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-2xl mb-4">Manage Exam #{id}</h1>

      <div className="bg-[#1f1f1f] p-4 mb-6 rounded">
        <input
          placeholder="Question text"
          className="w-full p-2 mb-2 bg-black"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        {["a","b","c","d"].map(k => (
          <input
            key={k}
            placeholder={`Option ${k}`}
            className="w-full p-2 mb-2 bg-black"
            value={options[k]}
            onChange={e => setOptions({ ...options, [k]: e.target.value })}
          />
        ))}

        <select
          value={correctOption}
          onChange={e => setCorrectOption(e.target.value)}
          className="mb-2 bg-black p-2"
        >
          <option>a</option>
          <option>b</option>
          <option>c</option>
          <option>d</option>
        </select>

        <input
          placeholder="Marks"
          type="number"
          className="w-full p-2 mb-2 bg-black"
          value={marks}
          onChange={e => setMarks(e.target.value)}
        />

        <button
          onClick={addQuestion}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>

      <h2 className="text-xl mb-2">Questions</h2>
      {questions.map((q, i) => (
        <p key={i}>{i + 1}. {q.text} ({q.marks} marks)</p>
      ))}
    </div>
  );
}
