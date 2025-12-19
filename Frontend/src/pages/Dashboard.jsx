import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch current logged-in user from backend session
    api
      .get("/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // session expired or not logged in
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = async () => {
    await api.post("/logout");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#101010] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

          <p className="text-gray-400 mb-8">
            Role: <span className="text-green-400">{user.role}</span>
          </p>

          <div className="">
            {user.role === "ADMIN" ? (
              <AdminDashboard/>
            ) : (
              <p>Student dashboard (view exams, attempt exams, etc.)</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
