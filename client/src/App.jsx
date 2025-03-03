import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import "./styles/global.css";

function App() {
  // Хранение состояния темы (единственный источник правды!)
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />        
        <main className="main-content">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
