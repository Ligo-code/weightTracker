import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import "./styles/global.css";





function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
