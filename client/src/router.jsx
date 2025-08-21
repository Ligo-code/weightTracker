import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WeightChart from "./pages/WeightChart";
import Profile from "./pages/Profile";

const AppRouter = ({ isDarkMode }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />      
      <Route path="/weightchart" element={<WeightChart isDarkMode={isDarkMode} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRouter; 
