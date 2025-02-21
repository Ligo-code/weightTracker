import React from "react";
import { useNavigate } from "react-router-dom";
import WeightTracker from "../components/UI/WeightTracker";

const Tracker = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Проверяем, есть ли токен

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Weight Tracker</h1>
        <p>You need to be logged in to access this page.</p>
        <button onClick={() => navigate("/auth")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Weight Tracker</h1>
      <WeightTracker />
    </div>
  );
};

export default Tracker;
