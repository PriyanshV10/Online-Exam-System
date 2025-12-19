import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      setMessage("Registration successful. Please wait for admin approval.");

      // Optional: redirect to login after few seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const msg = err.response.data?.error || "Registration failed";

        if (status === 400) {
          setMessage(msg);
        } else if (status === 409) {
          setMessage(msg);
        } else {
          setMessage("Server error. Try again later.");
        }
      } else {
        setMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <form
        onSubmit={handleRegister}
        className="bg-[#282828] text-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Student Registration
        </h2>

        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && (
          <p className="text-sm text-center mb-4 text-blue-600">{message}</p>
        )}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>

        <p className="text-white mt-4 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
