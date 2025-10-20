import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginSignup({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://127.0.0.1:5000/login" : "http://127.0.0.1:5000/signup";
    
    try {
      const res = await axios.post(url, { username, password });
      setMessage(res.data.message || "Success!");

      if (isLogin && res.data.user_id) {
        localStorage.setItem("user_id", res.data.user_id);
        onLogin(); // go to Home after successful login
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="btn btn-link p-0" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        {message && <div className="alert alert-info text-center mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default LoginSignup;
