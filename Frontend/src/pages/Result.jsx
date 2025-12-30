import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";

export default function Result() {
  const { id } = useParams();

  const [result, setResult] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResult = async () => {
    try {
      const res = await api.get(`/attempts/${id}/result`);
      setResult(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white">
        {error}
      </div>
    );
  }

  return <div className="min-h-screen bg-[#101010] text-white p-8">hello</div>;
}
