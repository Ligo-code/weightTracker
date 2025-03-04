import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken, logoutUser } from "../api/auth";
import WeightTracker from "../components/UI/WeightTracker";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      handleSessionExpired();
      return;
    }

    try {
      const response = await fetch(
        "https://weighttracker-heqj.onrender.com/api/users/profile",
        /*"http://localhost:5000/api/users/profile",*/
        {
          headers: { Authorization: `Bearer ${token}`},
        }
      );

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          return fetchUserData();
        } else {
          throw new Error("Session expired. Please log in again.");
        }
      }

      const data = await response.json();

      console.log("Fetched user data:", data);
      setUser(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      handleSessionExpired();
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/"); // Если нет токена, перенаправляем на Home
    } else {
      fetchUserData();
    }    
  }, []);

  const handleSessionExpired = () => {
    setError("Your session has expired. Please log in again.");
    logoutUser();
    navigate("/");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const currentWeight = user?.currentWeight || user?.initialWeight;
  const targetWeight = user?.targetWeight || 0;
  const initialWeight = user?.initialWeight || currentWeight;

  let progressPercentage = 0;

  if (user?.goal === "lose") {
    if (initialWeight > targetWeight) {
      progressPercentage = ((initialWeight - currentWeight) / (initialWeight - targetWeight)) * 100;
    }
  } else if (user?.goal === "gain") {
    if (initialWeight < targetWeight) {
      progressPercentage = ((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100;
    }
  }
  
  progressPercentage = Math.max(0, Math.min(progressPercentage, 100)).toFixed(1);

  if (!user) {
    return (
      <div className={styles.container}>
        <h2>Profile</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <p>Loading user data...</p>
        )}
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
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Goal:</strong> {user.goal === "lose" ? "Lose Weight" : "Gain Weight"}
          </p>
          <p>
            <strong>Initial Weight:</strong> {user.initialWeight} kg
          </p>
          <p>
            <strong>Current Weight:</strong> {user.currentWeight} kg
          </p>
          <p>
            <strong>Target Weight:</strong> {user.targetWeight} kg
          </p>
          <p>
            <strong>Progress:</strong> {progressPercentage}% of target
          </p>
        </div>
      )}
      <WeightTracker fetchUserData={fetchUserData} />
    </div>
  );
};

export default Profile;