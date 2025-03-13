import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Import icons from Lucide

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000); // Auto remove toast after 3s
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg transition-all duration-300 transform ${
              toast.type === "success"
                ? "bg-green-500 animate-pulse"
                : "bg-red-500 animate-pulse"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="text-white w-6 h-6" />
            ) : (
              <XCircle className="text-white w-6 h-6" />
            )}
            <span className="text-lg font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
