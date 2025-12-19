import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamList from "./pages/ExamList";
import ExamAttempt from "./pages/ExamAttempt";
import Result from "./pages/Result";

import Navbar from "./components/Navbar";
import api from "./api/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exam/:id" element={<ExamAttempt />} />
        <Route path="/results" element={<Result />} />
      </Routes>
    </>
  );
}
