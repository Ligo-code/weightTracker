import React, { useState } from "react";
import { registerUser, loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Auth.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const data = isLogin ? await loginUser(formData) : await registerUser(formData);
  
        // Сохраняем accessToken и refreshToken в localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
  
        alert(isLogin ? "Login successful!" : "Registration successful!");
        navigate("/profile"); // Перенаправляем на страницу профиля
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong. Try again.");
      }
    };

  return (
    <div className={styles.authContainer}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
      {!isLogin &&(
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name || ""}
          onChange={handleChange}
          required />)}
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
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create an account" : "Already have an account?"}
      </button>
    </div>
  );
};

export default AuthForm;
