import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./templates/LoginSignup";
import Home from "./templates/Home";
import Dashboard from "./templates/Dashboard";
import JobForm from "./templates/JobForm";

function App() {
  // Track whether user is logged in (based on localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("user_id")
  );

  // After successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // On logout — clear user info
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* If user not logged in, show Login/Signup page for all routes */}
        {!isAuthenticated ? (
          <Route path="*" element={<LoginSignup onLogin={handleLogin} />} />
        ) : (
          <>
            {/* Home Page */}
            <Route path="/" element={<Home onLogout={handleLogout} />} />

            {/* Dashboard Page */}
            <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />

            {/* Create Job Page */}
            <Route path="/create-job" element={<JobForm onLogout={handleLogout} />} />

            {/* Fallback for unknown paths */}
            <Route path="*" element={<Home onLogout={handleLogout} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
