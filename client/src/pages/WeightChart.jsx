import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWeightEntries } from "../api/weight";
import { refreshToken, logoutUser } from "../api/auth";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../styles/WeightChart.module.css";

const WeightChart = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/"); // 🔹 Если нет токена, сразу редирект на логин
      return;
    }
    fetchUserData();
    fetchEntries();
  }, [timeRange, token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          return fetchUserData();
        } else {
          throw new Error("Session expired.");
        }
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      handleSessionExpired();
    }
  };

  const fetchEntries = async () => {
    try {
      const data = await getWeightEntries();
      if (data.entries) {
        const sortedEntries = data.entries.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setEntries(sortedEntries);
      }
    } catch (err) {
      handleSessionExpired();
    }
  };

  const handleSessionExpired = () => {
    setError("Your session has expired. Please log in again.");
    logoutUser();
    navigate("/");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const filterEntriesByRange = () => {
    const now = new Date();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (timeRange === "week") return now - entryDate <= 7 * 24 * 60 * 60 * 1000;
      if (timeRange === "month") return now - entryDate <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  };

  const chartData = {
    labels: filterEntriesByRange().map((entry) =>
      new Date(entry.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: filterEntriesByRange().map((entry) => entry.weight),
        borderColor: "#2c3e36",
        backgroundColor: "rgba(44, 62, 54, 0.1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2>Weight Chart</h2>
      {error && <p className={styles.error}>{error}</p>}

      {user && (
        <div className={styles.userInfo}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <div className={styles.controls}>
        <button onClick={() => setTimeRange("week")}>Last 7 Days</button>
        <button onClick={() => setTimeRange("month")}>Last Month</button>
        <button onClick={() => setTimeRange("all")}>All Time</button>
      </div>

      {entries.length === 0 ? <p>No weight data available.</p> : <Line data={chartData} />}
    </div>
  );
};

export default WeightChart;
