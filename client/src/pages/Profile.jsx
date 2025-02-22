import { useEffect, useState } from "react";
import { refreshToken, logoutUser } from "../api/auth";
import WeightTracker from "../components/UI/WeightTracker";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css"; // Подключаем стили

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/auth");
        return;
      }

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
        localStorage.setItem("user", JSON.stringify(data)); // Сохраняем данные пользователя
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user"); // Удаляем данные пользователя
    navigate("/auth");
  };

  return (
    <div>
      {user && (
        <div className={styles.userInfo}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      )}

      <h2 className={styles.title}>Profile</h2>
      <WeightTracker />

      {error && <p className={styles.error}>{error}</p>}
      {!user && <p>Loading...</p>}
    </div>
  );
};

export default Profile;
