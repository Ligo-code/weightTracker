import React, { useState, useEffect } from "react";
import styles from "../../styles/Toast.module.css";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${
        !visible ? styles.hiding : ""
      }`}
    >
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default Toast;
