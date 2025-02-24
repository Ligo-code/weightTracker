import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";

const Navbar = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleProtectedRoute = (path) => {
    if (!token) {
      navigate("/"); // Если нет токена, перенаправляем на Home
    } else {
      navigate(path);
    }
  };

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>Weight Tracker</h2>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/weightchart" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Weight Chart
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Profile
          </NavLink>
        </li>
        {token && (
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
              onClick={handleLogout}
            >
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};   

export default Navbar;
