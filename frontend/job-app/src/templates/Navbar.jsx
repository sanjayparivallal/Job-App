import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../app.css";

function Navbar({ onLogout }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const handleStorageChange = (e) => {
      if (e.key === "username") setUsername(e.newValue || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="navbar-custom">
      <h3>Job Portal</h3>
      <div className="d-flex align-items-center">
        <Link to="/" className="btn btn-link">Home</Link>
        <Link to="/dashboard" className="btn btn-link">Dashboard</Link>
  {/* Profile link removed since Dashboard includes profile features */}
        {username && <span className="mx-3 text-primary">Welcome, {username}!</span>}
      </div>
      <button className="btn btn-outline-danger" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
