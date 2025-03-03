import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";
import {  FaMoon, FaSun, FaHome, FaChartLine, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleProtectedRoute = (path) => {
    if (!token) {
      navigate("/"); 
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
            <FaHome title="Home" /> 
          </NavLink>
        </li>
        <li>
          <NavLink to="/weightchart" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            <FaChartLine title="Weight Chart" /> 
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            <FaUser title="Profile" /> 
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="#" 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            {isDarkMode ? <FaSun title="Light Mode" /> : <FaMoon title="Dark Mode" />} 
          </NavLink>
        </li>
        {token && (
          <li>
            <NavLink 
              to="/" 
              onClick={handleLogout} 
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              <FaSignOutAlt title="Logout" /> 
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;