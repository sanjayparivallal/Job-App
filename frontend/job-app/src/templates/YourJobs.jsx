import React, { useState, useEffect } from "react";
import { fetchEmployerJobs, deleteJob } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { SkeletonJobCard } from "../components/SkeletonLoader";

function YourJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      const employerId = getCurrentUserId();
      if (!employerId) {
        setError(ERROR_MESSAGES.LOGIN_REQUIRED);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await fetchEmployerJobs(employerId);
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!confirm("Delete this job and all its applications? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(jobId);
      await deleteJob(jobId);
      
      // Optimistic UI update
      setJobs(prev => prev.filter(j => j.id !== jobId));
      
      // Optional: Show success message
      const successMsg = SUCCESS_MESSAGES.JOB_DELETED || "Job deleted successfully";
      console.log(successMsg);
    } catch (err) {
      alert(err.message || "Failed to delete job. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="your-jobs-container" aria-labelledby="your-jobs-heading">
        <h2 id="your-jobs-heading">Your Posted Jobs</h2>
        <div aria-live="polite" aria-busy="true">
          {[1, 2].map(i => (
            <SkeletonJobCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="your-jobs-container" aria-labelledby="your-jobs-heading">
        <h2 id="your-jobs-heading">Your Posted Jobs</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!jobs || jobs.length === 0) {
    return null; // Do not render if no jobs
  }

  return (
    <section className="your-jobs-container" aria-labelledby="your-jobs-heading">
      <h2 id="your-jobs-heading">Your Posted Jobs</h2>
      <div className="jobs-list">
        {jobs.map(job => (
          <article 
            key={job.id} 
            className="your-jobs-card d-flex justify-content-between align-items-center"
            aria-labelledby={`job-title-${job.id}`}
          >
            <div className="job-details">
              <h3 id={`job-title-${job.id}`} className="h5">{job.title}</h3>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
            </div>
            <button
              className="btn btn-danger delete-btn"
              onClick={() => handleDelete(job.id)}
              disabled={deletingId === job.id}
              aria-label={`Delete job posting: ${job.title}`}
            >
              {deletingId === job.id ? (
                <>
                  <span className="spinner spinner-sm" aria-hidden="true"></span>
                  <span className="ms-1">Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default YourJobs;
