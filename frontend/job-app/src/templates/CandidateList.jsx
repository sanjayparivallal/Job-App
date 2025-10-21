import { useEffect, useState } from "react";
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

    // Check if user has posted any jobs (use corrected route)
    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then(res => res.json())
      .then(data => {
        const has = Array.isArray(data) && data.length > 0;
        setHasJobs(has);
        if (has) {
          // Fetch candidate applications only if employer has jobs
          fetch(`http://127.0.0.1:5000/applications/${employer_id}`)
            .then(res => res.json())
            .then(data => setApplications(data))
            .catch(err => console.error(err));
        }
      })
      .catch(err => {
        console.error(err);
        setHasJobs(false);
      });
  }, []);

  const handleApplicationProcess = async (applicationId, action) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/applications/${applicationId}/process`,
        { action }
      );

      if (action === 'accept') {
        if (response.data?.mailto) {
          window.location.href = response.data.mailto;
        } else {
          alert('Mailto link not returned from server');
        }
      } else {
        setApplications(applications.filter(app => app.application_id !== applicationId));
        alert('Application rejected and removed');
      }
    } catch (error) {
      alert("Error processing application");
      console.error(error);
    }
  };

  if (!hasJobs) return null;

  return (
    <div className="mb-5">
      <h2>Candidate List</h2>
      <div className="list-group">
        {applications.length === 0 ? (
          <p className="text-muted">No candidates have applied yet.</p>
        ) : (
          applications.map((application) => (
            <div key={application.application_id} className="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm">
              <div>
                <h5 className="mb-1">{application.full_name}</h5>
                <small className="text-muted">Applied for: {application.job_title}</small>
                <p className="mb-0 mt-2 small">
                  <strong>Email:</strong> {application.email} &nbsp; | &nbsp;
                  <strong>Phone:</strong> {application.phone}
                </p>
                <p className="mb-0 mt-2 small">
                  <strong>Education:</strong> {application.education || 'N/A'} &nbsp; | &nbsp;
                  <strong>Experience:</strong> {application.experience || 'N/A'}
                </p>
                <p className="mb-0 mt-1 small"><strong>Skills:</strong> {application.skills || 'N/A'}</p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => handleApplicationProcess(application.application_id, 'accept')}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleApplicationProcess(application.application_id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CandidateList;
