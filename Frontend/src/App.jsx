import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamList from "./pages/ExamList";
import ExamAttempt from "./pages/ExamAttempt";
import Result from "./pages/Result";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import api from "./api/api";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import CreateExam from "./pages/CreateExam";
import EditExam from "./pages/EditExam";
import UpdateExam from "./pages/UpdateExam";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login setUser={setUser} />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <Register />
            </PublicRoute>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <ProtectedRoute user={user}>
              <ExamList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:id"
          element={
            <ProtectedRoute user={user}>
              <ExamAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute user={user}>
              <Result />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        
        <Route
          path="/admin/exams/create"
          element={
            <AdminRoute user={user}>
              <CreateExam />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/exams/:id"
          element={
            <AdminRoute user={user}>
              <EditExam />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams/:id/edit"
          element={
            <AdminRoute user={user}>
              <UpdateExam />
            </AdminRoute>
          }
        />
        {/* UNKNOWN ROUTES */}

        {/* If LOGGED IN → show 404 */}
        <Route
          path="*"
          element={user ? <NotFound /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}
