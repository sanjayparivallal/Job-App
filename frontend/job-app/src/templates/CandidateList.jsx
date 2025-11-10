import React, { useState, useEffect } from "react";
import axios from "axios";

function CandidateList() {
  const [applications, setApplications] = useState([]);
  const [hasJobs, setHasJobs] = useState(true);
  const [loading, setLoading] = useState(true);

  // Open system email client immediately (user gesture) with predefined content
  const openEmailForApplication = (app) => {
    try {
      const email = app.email || "";
      const jobTitle = app.job_title || "your job";
      const fullName = app.full_name || "Candidate";
      const subject = `Interview Invitation for ${jobTitle}`;
      const body =
        `Dear ${fullName},\n\n` +
        `Congratulations! You have been shortlisted for the position '${jobTitle}'.\n` +
        `Please reply to this email to schedule your interview.\n\n` +
        `Best regards,\nYour Hiring Team`;

      const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Prefer direct navigation to keep it as a trusted user gesture
      window.location.href = mailto;
    } catch (e) {
      // Fallback: hidden anchor
      try {
        const link = document.createElement("a");
        link.href = mailto;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (_) {
        console.error("Failed to trigger mailto link");
      }
    }
  };

  // Accept flow: open email first, then notify backend and update UI
  const handleAccept = async (application) => {
    // Trigger email compose immediately on click
    openEmailForApplication(application);

    try {
      await axios.post(
        `http://127.0.0.1:5000/applications/${application.application_id}/process`,
        { action: "accept" }
      );
      // Remove from UI
      setApplications((prev) => prev.filter((a) => a.application_id !== application.application_id));
    } catch (error) {
      console.error("Error processing acceptance:", error);
      // Keep UI as-is but inform user
      alert("Email compose attempted. To finalize in app, please try again.");
    }
  };

  const handleApplicationProcess = async (applicationId, action) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/applications/${applicationId}/process`,
        { action }
      );
      if (action === "reject") {
        setApplications((prevApps) =>
          prevApps.filter((app) => app.application_id !== applicationId)
        );
        alert("Application rejected and removed.");
      }
    } catch (error) {
      console.error("Error processing application:", error);
      alert("Error processing application. Check console for details.");
    }
  };

  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");

    if (!employer_id) {
      setHasJobs(false);
      setLoading(false);
      return;
    }

    // ✅ Fetch employer’s jobs first
    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then((res) => res.json())
      .then((data) => {
        const has = Array.isArray(data) && data.length > 0;
        setHasJobs(has);

        if (has) {
          // ✅ Fetch candidates for those jobs
          fetch(`http://127.0.0.1:5000/applications/${employer_id}`)
            .then((res) => res.json())
            .then((data) => setApplications(data))
            .catch((err) => console.error("Error fetching applications:", err))
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching employer jobs:", err);
        setHasJobs(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading candidates...</p>
      </div>
    );
  }

  if (!hasJobs) return null;

  return (
    <div className="candidate-list-container dashboard-section">
      <h2 className="fw-bold text-center mb-4 border-bottom pb-2 text-primary dashboard-header">
        Candidate List
      </h2>

      {applications.length === 0 ? (
        <p className="text-muted text-center mt-4">
          No candidates have applied yet.
        </p>
      ) : (
        applications.map((application) => (
          <div
            key={application.application_id}
            className="candidate-card list-group-item mb-3 shadow-sm p-3 rounded d-flex justify-content-between align-items-center"
          >
            <div className="flex-grow-1">
              <h5 className="mb-1">{application.full_name}</h5>
              <small className="text-secondary d-block mb-2">
                Applied for:{" "}
                <strong className="job-title text-primary">
                  {application.job_title}
                </strong>
              </small>

              <p className="mb-1 small">
                <strong>Email:</strong> {application.email} &nbsp; | &nbsp;
                <strong>Phone:</strong> {application.phone}
              </p>
              <p className="mb-1 small">
                <strong>Education:</strong>{" "}
                {application.education || "N/A"} &nbsp; | &nbsp;
                <strong>Experience:</strong>{" "}
                {application.experience || "N/A"}
              </p>
              <p className="mb-0 small">
                <strong>Skills:</strong> {application.skills || "N/A"}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAccept(application)}
              >
                Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
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
  );
}

export default CandidateList;
