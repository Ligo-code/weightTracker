import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Tracker from "./pages/Tracker";
import Profile from "./pages/Profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/tracker" element={<Tracker />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRouter; 
