import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-gray-800 dark:text-yellow-400 transition-all active:scale-95 border border-black/5 dark:border-white/5 shadow-sm"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} className="text-zinc-700" />}
        </button>
    );
}
