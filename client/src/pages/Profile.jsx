import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken, logoutUser } from "../api/auth";
import WeightTracker from "../components/UI/WeightTracker";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return; // Если нет токена, не загружаем данные
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
            throw new Error("Session expired");
          }
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    logoutUser();
    navigate ("/");
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <h2>Profile</h2>
        <p>You need to be logged in to view this page.</p>
        <button onClick={() => navigate("/")} className={styles.button}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Profile</h2>
      {error && <p className={styles.error}>{error}</p>}
      {user && (
        <div className={styles.userInfo}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      )}
      <WeightTracker />
    </div>
  );
};

export default Profile;
