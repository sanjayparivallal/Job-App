import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../app.css";

function Navbar({ onLogout }) {
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const handleStorageChange = (e) => {
      if (e.key === "username") setUsername(e.newValue || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="navbar-backdrop" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <nav className="navbar-custom">
        <h3 className="navbar-logo">Job Portal</h3>
        
        {/* Hamburger menu for mobile */}
        <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="btn btn-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/dashboard" className="btn btn-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          </div>
          {username && <span className="navbar-welcome">Welcome, {username}!</span>}
          <button className="btn btn-outline-danger navbar-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
