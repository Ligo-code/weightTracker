import React from "react";
import AuthForm from "../components/UI/AuthForm";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to Weight Tracker</h1>
      <h3>Log your weight and track your progress over time.</h3>
      <AuthForm />
    </div>
  );
};

export default Home;
