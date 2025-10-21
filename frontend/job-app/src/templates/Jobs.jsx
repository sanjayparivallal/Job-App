import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id");
    fetch("http://127.0.0.1:5000/jobs")
      .then(res => res.json())
      .then(data => {
        // Filter out jobs where the job's id matches the current user's id
        const availableJobs = currentUserId 
          ? data.filter(job => String(job.id) !== currentUserId)
          : data;
        setJobs(availableJobs);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Jobs Available</h1>
      <div className="list-group">
        {jobs.length === 0 ? (
          <div className="text-center p-4 text-muted">No jobs available right now.</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm">
              {/* Job Details */}
              <div>
                <h5>{job.title}</h5>
                <p className="mb-1"><strong>Description:</strong> {job.description}</p>
                <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                <p className="mb-0"><strong>Salary:</strong> {job.salary}</p>
              </div>
              {/* Apply Button */}
              <button 
                className="btn btn-primary" 
                onClick={() => navigate(`/apply/${job.id}`)}
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;
