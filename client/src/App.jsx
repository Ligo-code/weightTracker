import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import Navbar from "./components/Layout/Navbar";
import "./styles/global.css";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />      
    </BrowserRouter>
  );
}

export default App;
