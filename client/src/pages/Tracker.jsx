import React, { useState, useEffect } from "react";
import { getWeightEntries } from "@/api/weight";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Подключаем автоматическую настройку Chart.js
import styles from "@/styles/Tracker.module.css";

const Tracker = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month"); // Диапазон: "week", "month", "all"

  useEffect(() => {
    fetchEntries();
  }, [timeRange]);

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
      setError(err.message);
    }
  };

  // Фильтрация записей по диапазону времени
  const filterEntriesByRange = () => {
    const now = new Date();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (timeRange === "week") {
        return now - entryDate <= 7 * 24 * 60 * 60 * 1000;
      } else if (timeRange === "month") {
        return now - entryDate <= 30 * 24 * 60 * 60 * 1000;
      }
      return true; // "all" - показываем всё
    });
  };

  // Подготовка данных для графика
  const chartData = {
    labels: filterEntriesByRange().map((entry) =>
      new Date(entry.date).toLocaleDateString()
    ),
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


  
  return (
    <div className={styles.container}>
      <h2>Weight Progress</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.controls}>
        <button onClick={() => setTimeRange("week")}>Last 7 Days</button>
        <button onClick={() => setTimeRange("month")}>Last Month</button>
        <button onClick={() => setTimeRange("all")}>All Time</button>
      </div>

      {entries.length === 0 ? (
        <p>No weight data available.</p>
      ) : (
        <div className={styles.chartContainer}>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Tracker;
