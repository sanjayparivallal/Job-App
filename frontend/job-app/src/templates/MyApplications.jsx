import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchApplicationsByApplicant, withdrawApplication } from "../utils/api";
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApplications() {
  const [myApplications, setMyApplications] = useState([]);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    const applicant_id = localStorage.getItem("user_id");
    fetchApplicationsByApplicant(applicant_id)
      .then((data) => setMyApplications(data))
      .catch((err) => console.error(err));
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    setWithdrawing(applicationId);
    try {
      await withdrawApplication(applicationId);
      setMyApplications(prev => prev.filter(app => app.application_id !== applicationId));
      toast.success("Application withdrawn successfully");
    } catch (error) {
      toast.error(error.message || "Failed to withdraw application");
    } finally {
      setWithdrawing(null);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">My Applications</h2>

      {myApplications.length === 0 ? (
        <p className="text-center text-muted">You have not applied to any jobs yet.</p>
      ) : (
        <div className="row">
          {myApplications.map((app) => (
            <div key={app.application_id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100 application-card">
                <div className="card-body">
                  <h5 className="card-title">{app.job_title}</h5>
                  <p className="card-text"><strong>Description:</strong> {app.description}</p>
                  <p className="card-text"><strong>Location:</strong> {app.location}</p>
                  <p className="card-text"><strong>Salary:</strong> {app.salary}</p>
                  <p className="card-text">
                    <strong>Education:</strong> {app.education || "N/A"} &nbsp; | &nbsp;
                    <strong>Experience:</strong> {app.experience || "N/A"}
                  </p>
                  <p className="card-text"><strong>Skills:</strong> {app.skills || "N/A"}</p>
                  <p className="card-text">
                    <strong>Email:</strong> {app.email} &nbsp; | &nbsp;
                    <strong>Phone:</strong> {app.phone}
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleWithdraw(app.application_id)}
                      disabled={withdrawing === app.application_id}
                    >
                      {withdrawing === app.application_id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Withdrawing...
                        </>
                      ) : (
                        "Withdraw Application"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
