import React, { useState } from "react";
import AuthForm from "../components/UI/AuthForm";
import { FaSignInAlt, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [authMode, setAuthMode] = useState(null); // "login" | "register" | null

  return (
    <div className={styles.container}>
      {!authMode ? (
        <>
          <h1>Welcome to Weight Tracker!</h1>
          <h3>Log your weight and track your progress over time!</h3>

          <div className={styles.buttonContainer}>
            <button onClick={() => setAuthMode("login")} className={styles.primaryButton}>
              <FaSignInAlt /> Login
            </button>
            <button onClick={() => setAuthMode("register")} className={styles.secondaryButton}>
              <FaUserPlus /> Create an account
            </button>
          </div>
        </>
      ) : (
        <div className={`${styles.authContainer} ${styles.fadeIn}`}>
          <h2>{authMode === "login" ? "Login" : "Create an Account"}</h2>
          <AuthForm mode={authMode} />
          <button onClick={() => setAuthMode(null)} className={styles.backButton}>
            <FaArrowLeft /> Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
