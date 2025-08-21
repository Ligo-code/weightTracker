import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";
import {
  FaMoon,
  FaSun,
  FaHome,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

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
      <div className={styles.navbarTop}>
        <h2 className={styles.logo}>Weight Tracker</h2>
        <div className={styles.navbarRight}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={styles.themeToggle}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }
              >
                <FaHome title="Home" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/weightchart"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }
              >
                <FaChartLine title="Weight Chart" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }
              >
                <FaUser title="Profile" />
              </NavLink>
            </li>
            {token && (
              <li>
                <NavLink
                  to="/"
                  onClick={handleLogout}
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  <FaSignOutAlt title="Logout" />
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
