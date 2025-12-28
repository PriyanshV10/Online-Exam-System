import { useEffect, useState } from "react";
import api from "../api/api";
import ExamManagement from "../components/ExamManagement";
import UserManagement from "../components/UserManagent";

export default function StudentDashboard() {
  const [stats, setStats] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div>
        
    </div>
  );
}
