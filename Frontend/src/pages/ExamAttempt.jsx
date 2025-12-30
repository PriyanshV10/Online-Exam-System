import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ExamAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const attemptExam = async () => {
    try {
      const res = await api.post(`/exams/${id}/attempt`);
      const aid = res.data.data.attemptId;

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
      console.log(res.data.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to fetch attempt");
    }
  }

  useEffect(() => {
    attemptExam();
  }, [id]);

  // find attempt first
  // if attempt found, set exam status to attempting
  // if no attempt found, create new attempt

  const [examStatus, setExamStatus] = useState("not-started");

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
    <div className="min-h-screen bg-[#101010] text-white p-8">
      {examStatus === "not-started" && <div></div>}
    </div>
  );
}
