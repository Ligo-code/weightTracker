import React, { useState, useEffect } from "react";
import {
  getWeightEntries,
  addWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
} from "../../api/weight";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/WeightTracker.module.css";

const WeightTracker = ({ fetchUserData }) => {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to access this page.");
      return;
    }
    fetchEntries();
  }, [token, currentPage]);

  const fetchEntries = async () => {
    try {
      const data = await getWeightEntries(currentPage, 5);
      console.log("Entries received:", data);

      setCurrentWeight(data.entries[0] || null); // ✅ Current Weight теперь всегда на каждой странице
      setEntries(data.entries.slice(1) || []);

      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      setError("You must be logged in to add an entry.");
      return;
    }
  
    try {
      const date = new Date().toISOString();
  
      if (editingId) {
        console.log("Updating entry ID:", editingId);
        const updatedEntry = await updateWeightEntry(editingId, { weight, note, date });
  
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === editingId ? { ...entry, weight, note } : entry
          )
        );
  
        setEditingId(null);
      } else {
        const newEntry = await addWeightEntry(weight, note, date);
  
        // Обновляем currentWeight в карточке
        setCurrentWeight(newEntry);
  
        // Добавляем currentWeight в начало списка ТОЛЬКО на первой странице
        setEntries((prevEntries) => 
          currentPage === 1 ? [newEntry, ...prevEntries] : prevEntries
        );
      }
  
      setWeight("");
      setNote("");
      await fetchUserData();
    } catch (err) {
      console.error("[Handle Submit Error]:", err.message);
      setError(err.message);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      await deleteWeightEntry(id);
      if (currentWeight && currentWeight._id === id) {
        setCurrentWeight(null);
      }
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      await fetchUserData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (entry) => {
    console.log("Editing entry ID:", entry._id);
    setWeight(entry.weight);
    setNote(entry.note || "");
    setEditingId(entry._id);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchEntries();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/auth");
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
          step="0.1" // ✅ Разрешаем ввод десятичных дробей
          placeholder="Enter your weight"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value) || "")}
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

      {currentWeight && (
        <ul className={styles.list}>
  {/* 🔹 Current Weight в зеленой карточке (всегда без редактирования) */}
  <li key="current-weight-card" className={`${styles.listItem} ${styles.currentWeightItem}`}>
  <div className={styles.entryContent}>
    <strong>{formatDate(currentWeight.date)}</strong>
    <span>{currentWeight.weight} kg</span>
    <p className={styles.currentWeightLabel}>Current Weight</p> {/* 🔹 Добавлено */}
    <p className={styles.note}>{currentWeight.note || "No note"}</p>
  </div>
</li>

  {/* 🔹 Current Weight в списке (только на первой странице, с редактированием) */}
  {currentPage === 1 && currentWeight && (
    <li key="current-weight-list" className={styles.listItem}>
      <div className={styles.entryContent}>
        <strong>{formatDate(currentWeight.date)}</strong>
        <span>{currentWeight.weight} kg</span>
        <p className={styles.note}>{currentWeight.note || "No note"}</p>
      </div>
      <div className={styles.entryActions}>
        <button
          onClick={() => handleEdit(currentWeight)}
          className={styles.editButton}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => handleDelete(currentWeight._id)}
          className={styles.deleteButton}
        >
          ❌ Delete
        </button>
      </div>
    </li>
  )}

  {/* 🔹 Остальные записи */}
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
