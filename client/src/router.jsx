import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Tracker from "./pages/Tracker";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/tracker" element={<Tracker />} />
            </Routes>
        </Router>
    );
};

export default AppRouter; // Должен быть default export
