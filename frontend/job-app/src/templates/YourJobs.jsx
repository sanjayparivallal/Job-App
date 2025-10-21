import { useEffect, useState } from "react";
import axios from "axios";

function YourJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  if (jobs.length === 0) return null;

  return (
    <div className="mb-5">
      <h2>Your jobs</h2>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm"
        >
          <div>
            <h5>{job.title}</h5>
            <p className="mb-1">
              <strong>Description:</strong> {job.description}
            </p>
            <p className="mb-1">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="mb-0">
              <strong>Salary:</strong> {job.salary}
            </p>
          </div>
          <button className="btn btn-danger" onClick={async () => {
            if (!confirm('Delete this job and its applications?')) return;
            try {
              const res = await axios.delete(`http://127.0.0.1:5000/jobs/${job.id}`);
              // remove from state
              setJobs(prev => prev.filter(j => j.id !== job.id));
            } catch (err) {
              console.error(err);
              alert('Failed to delete job');
            }
          }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default YourJobs;
