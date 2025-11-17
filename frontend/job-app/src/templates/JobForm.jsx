import { useState } from "react";
import toast from "react-hot-toast";
import { createJob } from "../utils/api";
import Navbar from "./Navbar";
import "../app.css"; // Make sure your app.css includes the JobForm styles below

function JobForm({ onLogout }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employer_id = localStorage.getItem("user_id");
    if (!employer_id) {
      toast.error("You must be logged in to post a job.");
      return;
    }

    setLoading(true);
    try {
      await createJob({
        title,
        description,
        location,
        salary,
        employer_id,
      });
      toast.success("Job posted successfully! 🎉");
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
    } catch (err) {
      toast.error(err.message || "Failed to post job");
    } finally {
      setLoading(false);
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
                placeholder="Write a detailed job description..."
                rows="8"
                required
                style={{ resize: "vertical" }}
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
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default JobForm;
