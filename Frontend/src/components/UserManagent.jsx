import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Check, X, Search, Filter, User, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

const UserManagement = ({ refreshStats }) => {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI State
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isDangerous: false
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

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

  const confirmUpdate = (user, status) => {
    const isReject = status === "REJECTED";
    setConfirmModal({
      isOpen: true,
      title: isReject ? "Reject User" : "Approve User",
      message: isReject
        ? `Are you sure you want to reject ${user.name}? They will lose access to the system.`
        : `Are you sure you want to approve ${user.name}? They will gain access to the system.`,
      isDangerous: isReject,
      onConfirm: async () => {
        try {
          await api.patch(`/admin/users/${user.id}`, { status });
          showToast(`User ${isReject ? "rejected" : "approved"} successfully`);
          fetchUsers();
          refreshStats();
        } catch (err) {
          showToast(err?.response?.data?.message || "Failed to update user", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-8 text-center">{error}</div>;
  }

  return (
    <div className="mt-8">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDangerous={confirmModal.isDangerous}
      />

      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
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

      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5">
          <User size={48} className="mx-auto mb-3 opacity-20" />
          <p>No users found in the system</p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-2xl bg-white dark:bg-transparent border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <div className="flex flex-col">
            {/* Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">User</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                    {/* User Info */}
                    <div className="col-span-4 w-full flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-500/20 dark:to-indigo-500/20 border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 shrink-0">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium truncate">{user.name}</span>
                    </div>

                    {/* Email */}
                    <div className="col-span-4 w-full text-gray-500 dark:text-gray-400 text-sm break-all">
                      {user.email}
                    </div>

                    {/* Status */}
                    <div className="col-span-2 w-full flex md:justify-start justify-between items-center">
                      <span className="md:hidden text-gray-500 text-xs font-medium uppercase mr-2">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.status === "APPROVED"
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                        : user.status === "REJECTED"
                          ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                          : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        }`}>
                        {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 w-full flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => confirmUpdate(user, "APPROVED")}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => confirmUpdate(user, "REJECTED")}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-zinc-900/50">
            <span className="text-sm text-gray-500">
              Showing <span className="text-slate-900 dark:text-white font-medium">{Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredUsers.length)}</span> to <span className="text-slate-900 dark:text-white font-medium">{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}</span> of <span className="text-slate-900 dark:text-white font-medium">{filteredUsers.length}</span> users
            </span>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-0 dark:hover:bg-white/10 text-gray-400 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-0 dark:hover:bg-white/10 text-gray-400 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
