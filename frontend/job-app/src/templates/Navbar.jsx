import { Link } from "react-router-dom";

function Navbar({ onLogout }) {
  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
      <h3>Job Portal</h3>
      <div>
        <Link to="/" className="btn btn-link">Home</Link>
        <Link to="/dashboard" className="btn btn-link">Dashboard</Link>
      </div>
      <button className="btn btn-outline-danger" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
