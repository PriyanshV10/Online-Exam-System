import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function ProtectedLayout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session on load
    api
      .get("/me")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
        navigate("/");
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
      <Navbar user={user} setUser={setUser} />
      <main>{children}</main>
    </>
  );
}
