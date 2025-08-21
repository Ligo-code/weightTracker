import React, { useState } from "react";
import AuthForm from "../components/UI/AuthForm";
import { FaSignInAlt, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [authMode, setAuthMode] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      {!authMode ? (
        <>
          <h1>Welcome to Weight Tracker!</h1>
          <h2>Log your weight and track your progress over time!</h2>

          <div className={styles.buttonContainer}>
            <button
              onClick={() => setAuthMode("login")}
              className={styles.primaryButton}
            >
              <FaSignInAlt /> Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={styles.secondaryButton}
            >
              <FaUserPlus /> Create an account
            </button>
          </div>
        </>
      ) : (
        <div className={`${styles.authContainer} ${styles.fadeIn}`}>
          <h2>{authMode === "login" ? "" : ""}</h2>
          <AuthForm authMode={authMode} setLoading={setLoading} />
          <div className={styles.authButtonRow}>
            <button
              onClick={() => setAuthMode(null)}
              className={styles.backButton}
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              form="auth-form"
              disabled={loading}
              className={styles.authSubmitButton}
            >
              {loading
                ? "Processing..."
                : authMode === "login"
                ? "Login"
                : "Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
