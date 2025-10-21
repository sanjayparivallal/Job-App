import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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

      if (action === "accept") {
        if (response.data?.mailto) {
          window.location.href = response.data.mailto;
        } else {
          alert("Mailto link not returned from server");
        }
      } else {
        setApplications(applications.filter(app => app.application_id !== applicationId));
        alert("Application rejected and removed");
      }
    } catch (error) {
      alert("Error processing application");
      console.error(error);
    }
  };

  if (!hasJobs) return null;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold text-center mb-4 border-bottom pb-2 text-primary">
        Candidate List
      </h2>

      <div className="list-group">
        {applications.length === 0 ? (
          <p className="text-muted text-center mt-4">No candidates have applied yet.</p>
        ) : (
          applications.map(application => (
            <div
              key={application.application_id}
              className="list-group-item mb-3 shadow-sm p-4 border-0 rounded-4 d-flex justify-content-between align-items-center flex-wrap"
              style={{
                backgroundColor: "#f8f9fa",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
              }}
            >
              {/* Left: Candidate Details */}
              <div className="flex-grow-1">
                <h5 className="mb-1 text-dark">{application.full_name}</h5>
                <small className="text-secondary d-block mb-2">
                  Applied for: <strong>{application.job_title}</strong>
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

              {/* Right: Buttons - aligned horizontally and centered vertically */}
              <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                <button
                  className="btn btn-success btn-sm px-3 rounded-pill shadow-sm"
                  onClick={() =>
                    handleApplicationProcess(application.application_id, "accept")
                  }
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger btn-sm px-3 rounded-pill shadow-sm"
                  onClick={() =>
                    handleApplicationProcess(application.application_id, "reject")
                  }
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
