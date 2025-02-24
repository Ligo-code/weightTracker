import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  // Обновляем токен при изменениях в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>Weight Tracker</h2>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : "")}>
            Home
          </NavLink>
        </li>
        {token ? (
          <>
            <li>
              <NavLink to="/weightchart" className={({ isActive }) => (isActive ? styles.active : "")}>
                Weight Chart
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : "")}>
                Profile
              </NavLink>
            </li>            
          </>
        ) : (
          <li>
            <NavLink to="/auth" className={({ isActive }) => (isActive ? styles.active : "")}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
