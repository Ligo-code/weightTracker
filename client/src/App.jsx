import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import ToastContainer from "./components/UI/ToastContainer";
import { useToast } from "./hooks/useToast";
import "./styles/global.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const { toasts, removeToast, showSuccess, showError, showWarning } =
    useToast();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="main-content">
          <AppRouter isDarkMode={isDarkMode} />
        </main>
        <Footer />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
