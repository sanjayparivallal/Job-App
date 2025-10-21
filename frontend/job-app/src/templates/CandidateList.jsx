import React, { useState, useEffect } from "react";
import axios from "axios";

function CandidateList() {
  const [applications, setApplications] = useState([]);
  const [hasJobs, setHasJobs] = useState(true);

  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");
    if (!employer_id) {
      setHasJobs(false);
      return;
    }

    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then(res => res.json())
      .then(data => {
        const has = Array.isArray(data) && data.length > 0;
        setHasJobs(has);
        if (has) {
          fetch(`http://127.0.0.1:5000/applications/${employer_id}`)
            .then(res => res.json())
            .then(data => setApplications(data))
            .catch(err => console.error(err));
        }
      })
      .catch(err => setHasJobs(false));
  }, []);

  if (!hasJobs) return null; // Do not render if no jobs posted

  return (
    <div className="candidate-list-container dashboard-section">
      <h2 className="fw-bold text-center mb-4 border-bottom pb-2 text-primary dashboard-header">
        Candidate List
      </h2>

      {applications.length === 0 ? (
        <p className="text-muted text-center mt-4">No candidates have applied yet.</p>
      ) : (
        applications.map(application => (
          <div
            key={application.application_id}
            className="candidate-card list-group-item mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div className="flex-grow-1">
              <h5 className="mb-1">{application.full_name}</h5>
              <small className="text-secondary d-block mb-2">
                Applied for: <strong className="job-title">{application.job_title}</strong>
              </small>

              <p className="mb-1 small">
                <strong>Email:</strong> {application.email} &nbsp; | &nbsp;
                <strong>Phone:</strong> {application.phone}
              </p>
              <p className="mb-1 small">
                <strong>Education:</strong> {application.education || "N/A"} &nbsp; | &nbsp;
                <strong>Experience:</strong> {application.experience || "N/A"}
              </p>
              <p className="mb-0 small">
                <strong>Skills:</strong> {application.skills || "N/A"}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <button className="btn btn-success btn-sm">Accept</button>
              <button className="btn btn-danger btn-sm">Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CandidateList;
