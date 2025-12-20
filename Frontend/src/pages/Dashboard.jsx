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
        navigate("/login");
      });
  }, [navigate]);

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
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

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
