import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchEmployerJobs, fetchApplicationsByEmployer, updateApplicationStatus, exportCandidatesToCSV } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES, APPLICATION_STATUS } from "../utils/constants";
import { SkeletonCard } from "../components/SkeletonLoader";

function CandidateList() {
  const [applications, setApplications] = useState([]);
  const [hasJobs, setHasJobs] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    const employerId = getCurrentUserId();
    if (!employerId) {
      toast.error("Please log in to export data");
      return;
    }

    setExporting(true);
    try {
      await exportCandidatesToCSV(employerId);
      toast.success("Candidates exported successfully! 📊");
    } catch (error) {
      toast.error(error.message || "Failed to export candidates");
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  // Open system email client immediately (user gesture) with predefined content
  const openEmailForApplication = (app) => {
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

    // Create a temporary link and click it
    const link = document.createElement("a");
    link.href = mailto;
    link.target = "_blank";
    link.click();
  };

  // Accept flow: open email first, then notify backend and update UI
  const handleAccept = async (application) => {
    // Trigger email compose immediately on click
    openEmailForApplication(application);

    setProcessingId(application.application_id);
    try {
      await updateApplicationStatus(application.application_id, APPLICATION_STATUS.ACCEPTED);
      
      // Optimistic UI update - remove from list
      setApplications((prev) => prev.filter((a) => a.application_id !== application.application_id));
      // No toast notification - email client opening is the feedback
    } catch (error) {
      console.error("Error processing acceptance:", error);
      toast.error(error.message || "Failed to update application status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId) => {
    // Confirm before rejecting (permanent deletion)
    if (!window.confirm("Are you sure you want to reject this candidate? This will permanently remove their application.")) {
      return;
    }
    
    setProcessingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, APPLICATION_STATUS.REJECTED);
      
      // Optimistic UI update
      setApplications((prevApps) =>
        prevApps.filter((app) => app.application_id !== applicationId)
      );
      toast.success("Candidate rejected and removed");
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error(error.message || "Failed to reject candidate");
    } finally {
      setProcessingId(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="fw-bold text-primary dashboard-header mb-0">
          Candidate List
        </h2>
        {applications.length > 0 && (
          <button 
            className="btn btn-success"
            onClick={handleExportCSV}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Exporting...
              </>
            ) : (
              <>
                📊 Export to CSV
              </>
            )}
          </button>
        )}
      </div>

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
              {application.resume_path && (
                <p className="mb-0 small mt-2">
                  <a
                    href={`http://127.0.0.1:5000/resumes/${application.application_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    📄 View Resume
                  </a>
                </p>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAccept(application)}
                disabled={processingId === application.application_id}
              >
                Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleReject(application.application_id)}
                disabled={processingId === application.application_id}
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
