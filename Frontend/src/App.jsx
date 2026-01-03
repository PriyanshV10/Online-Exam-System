import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
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
import ExamManagement from "./pages/ExamManagement";
import UserManagement from "./pages/UserManagement";

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
      <div className="min-h-screen flex items-center justify-center text-slate-900 dark:text-white bg-slate-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="font-medium animate-pulse">Loading...</span>
        </div>
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
          path="/exam/:id"
          element={
            <ProtectedRoute user={user}>
              <ExamAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attempts/:id/result"
          element={
            <ProtectedRoute user={user}>
              <Result />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}

        <Route
          path="/admin/exams"
          element={
            <AdminRoute user={user}>
              <ExamManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute user={user}>
              <UserManagement />
            </AdminRoute>
          }
        />

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
      </Routes >
    </>
  );
}
