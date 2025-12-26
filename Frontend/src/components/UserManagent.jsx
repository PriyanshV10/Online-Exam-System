import React, { useEffect, useState } from "react";
import api from "../api/api";
import { BoxSelect, Check, Cross, Search, TextSelect, X } from "lucide-react";

const UserManagement = ({refreshStats}) => {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchStatus =
      statusFilter === "All" ||
      u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentPage, totalPages]);

  const handleUpdate = async (user, status) => {
    try {
      await api.patch(`/admin/users/${user.id}`, { status });
      fetchUsers();
      refreshStats();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user");
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="mt-8 rounded-xl bg-[#282828]">
      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#101010]">
            <h2 className="text-lg font-semibold">User Management</h2>

            <div className="flex gap-3">
              <div className="flex align-center justify-between gap-2 border border-gray-400 rounded-lg p-2">
                <Search className="mt-1 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="border border-gray-400 rounded-lg px-4 py-2 text-sm bg-[#282828] text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead className="bg-[#303030] text-left">
              <tr>
                <th className="p-4 border-r border-[#101010]">Name</th>
                <th className="p-4 border-r border-[#101010]">Email</th>
                <th className="p-4 border-r border-[#101010]">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-[#101010] hover:bg-[#303030]"
                >
                  <td className="p-4 border-r border-[#101010]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                        {user.name[0].toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>

                  <td className="p-4 border-r border-[#101010]">{user.email}</td>

                  <td className="p-4 border-r border-[#101010]">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : user.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "text-amber-700 bg-amber-100"
                    }`}
                    >
                      {user.status[0] + user.status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 h-full">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleUpdate(user, "APPROVED")}
                      >
                        <Check className="text-green-500" />
                      </button>

                      <button
                        className="cursor-pointer"
                        onClick={() => handleUpdate(user, "REJECTED")}
                      >
                        <X className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4 border-t border-[#101010] text-sm">
            <span>
              Showing {PAGE_SIZE * (currentPage - 1) + 1}-
              {Math.min(PAGE_SIZE * currentPage, paginatedUsers.length)} of{" "}
              {filteredUsers.length} users
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>

              <button
                className="px-3 py-1 border rounded-lg bg-blue-600 text-white disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
