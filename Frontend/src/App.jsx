import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ExamList from "./pages/ExamList";
import ExamAttempt from "./pages/ExamAttempt";
import Result from "./pages/Result";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exam/:id" element={<ExamAttempt />} />
        <Route path="/results" element={<Result />} />
      </Routes>
    </AuthProvider>
  );
}
