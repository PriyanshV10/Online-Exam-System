import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleUpdate = async (userId, status) => {
    try {
      const res = await api.post("/admin/update-user", { id: userId, status });
      alert(res.data.message);
      setUsers(users.filter((u) => u.id !== userId));
    } catch {
      alert("Failed to update user status!");
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading pending approvals...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin - User Approvals</h1>

      {users.length === 0 ? (
        <p className="text-gray-400">No pending users.</p>
      ) : (
        <table className="w-full bg-[#282828] rounded-lg overflow-hidden">
          <thead className="bg-[#1f1f1f]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleUpdate(user.id, "APPROVED")}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdate(user.id, "REJECTED")}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
