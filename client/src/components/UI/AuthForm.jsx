import React, { useState } from "react";
import { registerUser, loginUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Auth.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: "",
    targetWeight: "",
    initialWeight: "",
    currentWeight: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { email, password, name, goal, targetWeight, currentWeight, initialWeight } = formData;

    if (!email || !password) {
      setError("Please enter email and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!isLogin && (!name || !goal || !targetWeight || !initialWeight)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      console.log("Отправляю запрос на сервер:", isLogin ? { email, password } : formData);
      
      const data = isLogin
        ? await loginUser({ email, password })
        : await registerUser(formData);

      console.log("Ответ от сервера:", data);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      alert(isLogin ? "Login successful!" : "Registration successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Login/Register error:", error);
      console.log("Full error response:", error?.response);

      if (error.response && error.response.data) {
        const status = error.response.status;
        const message = error.response.data.message || "An error occurred.";
        console.log("Error Message Received from Server:", message);

        if (status === 401 || status === 400) {
          setError(message);
        } else if (status === 409) {
          setError("User with this email already exists.");
        } else if (status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError(message);
        }
      } else if (error.message === "Failed to fetch") {
        console.error("Network error. Please try again later.");
        setError("Network error. Please try again later.");
      } else {
        console.error("Login/Register error:", error);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Goal:</label>
            <select name="goal" value={formData.goal} onChange={handleChange} required>
              <option value="">Select a goal</option>
              <option value="lose">Lose Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight (kg)"
              value={formData.targetWeight}
              onChange={handleChange}
              min="1"
              required
            />
                        <input
              type="number"
              name="initialWeight"
              placeholder="Initial Weight (kg)"
              value={formData.initialWeight}
              onChange={handleChange}
              min="1"
              required
            />            
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button className={styles.switchBtn} onClick={() => setIsLogin(!isLogin)} disabled={loading}>
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
};

export default AuthForm;
