import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id");
    fetch("http://127.0.0.1:5000/jobs")
      .then(res => res.json())
      .then(data => {
        // Filter out jobs where the employer_id matches the current user's id
        const availableJobs = currentUserId 
          ? data.filter(job => String(job.employer_id) !== currentUserId)
          : data;
        setJobs(availableJobs);
      })
      .catch(err => console.error(err));
  }, []);

  // Filter jobs based on search input
  const filteredJobs = jobs.filter(job => {
    const q = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Search your next opportunity...</h2>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search for jobs..."
              aria-label="Search for jobs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={() => setSearch("")}>Clear</button>
          </div>
        </div>
      </div>
      <h1 className="mb-4 text-center">Jobs Available</h1>
      <div className="list-group">
        {filteredJobs.length === 0 ? (
          <div className="text-center p-4 text-muted">No jobs available right now.</div>
        ) : (
          filteredJobs.map((job) => (
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

export default JobSearch;
