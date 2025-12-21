import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      // store user in App state
      setUser(res.data.data);

      navigate("/");
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.error || "Login failed";

        if (status === 400 || status === 401 || status === 403) {
          alert(message);
        } else {
          alert("Something went wrong");
        }
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <form
        onSubmit={handleLogin}
        className="bg-[#282828] text-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Online Exam System
        </h2>

        <input
          type="email"
          className="w-full p-2 border rounded mb-4 text-white bg-transparent"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-6 text-white bg-transparent"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p className="text-white mt-4 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
