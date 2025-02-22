import React from "react";
import AuthForm from "../components/UI/AuthForm";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h2>Welcome to Weight Tracker</h2>
      <p>Log your weight and track your progress over time.</p>
      <AuthForm />
    </div>
  );
};

export default Home;
