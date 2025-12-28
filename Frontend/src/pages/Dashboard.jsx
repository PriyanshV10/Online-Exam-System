import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard({ user }) {
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
          <div className="bg-[#282828] w-3/4 mx-auto p-4 rounded-2xl flex gap-4">
            <div className="flex items-center">
              <img
                src={user.role === "ADMIN" ? `/assets/admin_avatar.png` : "/assets/student.png"}
                className="rounded-full w-20 h-20 mr-4"
                alt={user.name}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.role}</p>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="">
            {user.role === "ADMIN" ? <AdminDashboard /> : <StudentDashboard />}
          </div>
        </div>
      </div>
    </>
  );
}
