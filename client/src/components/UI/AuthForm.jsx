import React, { useState } from "react";
import { registerUser, loginUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Auth.module.css";

const AuthForm = ({ authMode }) => {

  const isLogin = authMode === "login"; 

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

    const {
      email,
      password,
      name,
      goal,
      targetWeight,      
      initialWeight,
    } = formData;

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

    if (!isLogin && (!name || !goal || !targetWeight || !initialWeight)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const data = isLogin
        ? await loginUser({ email, password })
        : await registerUser(formData);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      alert(isLogin ? "Login successful!" : "Registration successful!");
      navigate("/profile");
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
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
            <div className={styles.goalContainer}>              
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
              >
                <option value="">Select a goal</option>
                <option value="lose">Lose Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>
            <input
              type="number"
              name="initialWeight"
              placeholder="Initial Weight (kg)"
              value={formData.initialWeight}
              onChange={handleChange}
              min="1"
              required
            />
            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight (kg)"
              value={formData.targetWeight}
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
    </div>
  );
};

export default AuthForm;