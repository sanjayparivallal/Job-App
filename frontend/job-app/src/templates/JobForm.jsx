import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../app.css"; // Make sure your app.css includes the JobForm styles below

function JobForm({ onLogout }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employer_id = localStorage.getItem("user_id");
    if (!employer_id) {
      setMessage("You must be logged in to post a job.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/addjob", {
        title,
        description,
        location,
        salary,
        employer_id,
      });
      setMessage(res.data.message || "Job posted successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="job-form-container">
        <div className="job-form-card">
          <h2>Post a Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Job Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="text"
                className="form-control"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Post Job
            </button>
          </form>

          {message && (
            <div className="alert alert-info mt-3">{message}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default JobForm;
