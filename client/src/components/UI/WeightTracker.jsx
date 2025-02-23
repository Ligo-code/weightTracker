import React, { useState, useEffect } from "react";
import {
  getWeightEntries,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
} from "../../api/weight";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/WeightTracker.module.css";

const WeightTracker = () => {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;
    fetchEntries();
  }, [token, currentPage]);

  const fetchEntries = async () => {
    try {
      const data = await getWeightEntries(currentPage, 5);
      console.log("Entries received:", data);
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setError("You must be logged in to add an entry.");
  
    try {
      const date = new Date().toISOString();
  
      if (editingId) {
        await updateWeightEntry(editingId, { weight, note, date });
        setEditingId(null);
      } else {
        await addWeightEntry(weight, note, date);
      }
  
      setWeight("");
      setNote("");
  
      // 🔹 После добавления записи заново загружаем данные с сервера
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeightEntry(id);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (entry) => {
    setWeight(entry.weight);
    setNote(entry.note || "");
    setEditingId(entry._id);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const user = JSON.parse(localStorage.getItem("user")); // Получаем данные о пользователе

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/auth"); // Перенаправляем на страницу входа
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <h2>Weight Tracker</h2>
        <p>You need to be logged in to access this page.</p>
        <button onClick={() => navigate("/auth")} className={styles.button}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {user && (
        <div className={styles.userInfo}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      <h2>Weight Tracker</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter your weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          {editingId ? "Update Entry" : "Add Entry"}
        </button>
      </form>

      <h3>Previous Entries</h3>

      {entries === null ? (
        <p>Loading weight entries...</p>
      ) : entries.length === 0 ? (
        <p>No weight entries found.</p>
      ) : (
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry._id} className={styles.listItem}>
              <div className={styles.entryContent}>
                <strong>{formatDate(entry.date)}</strong>
                <span>{entry.weight} kg</span>
                <p className={styles.note}>{entry.note || "No note"}</p>
              </div>
              <div className={styles.entryActions}>
                <button
                  onClick={() => handleEdit(entry)}
                  className={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className={styles.deleteButton}
                >
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.pagination}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          ⬅ Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default WeightTracker;
