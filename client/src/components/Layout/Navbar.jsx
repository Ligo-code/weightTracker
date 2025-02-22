import { Link } from "react-router-dom";
import styles from "../../styles/Navbar.module.css";

const Navbar = () => {
  const token = localStorage.getItem("accessToken"); // Проверяем, авторизован ли пользователь

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>Weight Tracker</h2>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        {token && ( // Показываем, только если пользователь авторизован
          <>
            <li>
              <Link to="/weightchart">Weight Chart</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </>
        )}
        {!token && (
          <li>
            <Link to="/">Login</Link> {/* Ведёт на Home, где есть AuthForm */}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
