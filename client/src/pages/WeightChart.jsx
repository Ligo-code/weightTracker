import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { getWeightEntries } from "../api/weight";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "../styles/WeightChart.module.css";

const WeightChart = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Если нет токена — редиректим на логин
      return;
    }
    fetchEntries();
  }, [timeRange, token]);

  const fetchEntries = async () => {
    try {
      const data = await getWeightEntries();
      if (data.entries) {
        const sortedEntries = data.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEntries(sortedEntries);
      }
    } catch (err) {
      console.error("Error fetching weight data:", err);
      setError("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
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
    labels: filterEntriesByRange().map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (kg)",
        data: filterEntriesByRange().map((entry) => entry.weight),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.3,
      },
    ],
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <h2>Weight Chart</h2>
        <p>Your session has expired. Please log in again.</p>
        <button onClick={() => navigate("/")} className={styles.button}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Weight Chart</h2>
      {error && <p className={styles.error}>{error}</p>}
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
