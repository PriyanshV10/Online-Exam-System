import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === "success";

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
            <div className={`pl-4 pr-10 py-4 rounded-xl shadow-2xl flex items-center gap-3 border bg-white dark:bg-zinc-900 ${isSuccess ? 'border-green-200 dark:border-green-500/20 shadow-green-900/5' : 'border-red-200 dark:border-red-500/20 shadow-red-900/5'
                }`}>
                <div className={`p-2 rounded-full ${isSuccess ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500'}`}>
                    {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <div className="flex flex-col">
                    <h4 className={`font-bold text-sm ${isSuccess ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {isSuccess ? 'Success' : 'Error'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{message}</p>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
