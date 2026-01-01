import { Link } from "react-router-dom";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="glass-panel p-12 rounded-3xl text-center max-w-lg w-full relative z-10 animate-fade-in border border-white/10">
        <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-white/5 shadow-xl shadow-black/50">
          <FileQuestion size={48} className="text-purple-500" />
        </div>

        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-white">Page Not Found</h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 group"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
