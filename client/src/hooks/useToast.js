import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message, duration) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration) => {
      return addToast(message, "warning", duration);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
  };
};
