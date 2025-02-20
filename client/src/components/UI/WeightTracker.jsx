import React, { useState, useEffect } from "react";
import { 
  getWeightEntries, 
  addWeightEntry, 
  updateWeightEntry, 
  deleteWeightEntry 
} from "../../api/weight";
import styles from "../../styles/WeightTracker.module.css";

const WeightTracker = () => {
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // ID редактируемой записи

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeightEntries();
        console.log("Entries received in useEffect:", data); // Логируем данные
        setEntries(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await getWeightEntries();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const token = localStorage.getItem("accessToken"); // Добавляем токен
      const date = new Date().toISOString(); // Генерируем дату
  
      if (editingId) {
        // Редактируем запись
        const updatedEntry = await updateWeightEntry(editingId, { weight, note, date }, token);
        setEntries(entries.map((entry) => (entry._id === editingId ? updatedEntry : entry)));
        setEditingId(null);
      } else {
        // Добавляем новую запись
        const newEntry = await addWeightEntry(weight, note, date);
        setEntries([...entries, newEntry]);
      }
  
      setWeight("");
      setNote("");
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

  return (
    <div className={styles.container}>
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
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry._id} className={styles.listItem}>
            {entry.weight} kg - {entry.note || "No note"}
            <button onClick={() => handleEdit(entry)} className={styles.editButton}>✏️ Edit</button>
            <button onClick={() => handleDelete(entry._id)} className={styles.deleteButton}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeightTracker;
