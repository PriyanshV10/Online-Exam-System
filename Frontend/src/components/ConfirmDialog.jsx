import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isDangerous = false, isLoading = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div
                className="w-full max-w-md rounded-2xl p-6 relative animate-scale-in shadow-2xl shadow-black/10 dark:shadow-black/40 border bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDangerous ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'}`}>
                        <AlertTriangle size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl text-gray-500 hover:text-slate-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors font-medium border border-transparent dark:border-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${isDangerous
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20'
                                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
