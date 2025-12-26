import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-[#1f1f1f] text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">Online Exam System</Link>
      </h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-green-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-green-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
