import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWeightEntries } from "../api/weight";
import { refreshToken, logoutUser } from "../api/auth";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../styles/WeightChart.module.css";

const WeightChart = ({ isDarkMode }) => {  
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/");  
      return;
    }
    fetchUserData();
    fetchEntries();
  }, [timeRange, token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://weighttracker-heqj.onrender.com/api/users/profile", {
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
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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

  const filterEntriesByRange = () => {
    const now = new Date();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt).getTime();
      if (timeRange === "week") return now - entryDate <= 7 * 24 * 60 * 60 * 1000;
      if (timeRange === "month") return now - entryDate <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  };

  const chartData = {
    labels: filterEntriesByRange().map((entry) =>
      new Date(entry.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: filterEntriesByRange().map((entry) => entry.weight),
        borderColor: isDarkMode ? "#464C4F" : "#22a37e", 
        backgroundColor: isDarkMode ? "rgba(34, 163, 126, 0.1)" : "rgba(44, 62, 54, 0.1)",
        pointBackgroundColor: isDarkMode ? "#464C4F" : "#22a37e",
        pointBorderColor: isDarkMode ? "#464C4F" : "#22a37e",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#464C4F" : "#22a37e",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#464C4F" : "#22a37e",
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#464C4F" : "#22a37e",
        },
        grid: {
          color: isDarkMode ? "rgba(34, 163, 126, 0.1)" : "rgba(34, 163, 126, 0.1)",
        },
      },
    },
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

      {entries.length === 0 ? <p>No weight data available.</p> : <Line data={chartData} options={options} />}
    </div>
  );
};

export default WeightChart;
