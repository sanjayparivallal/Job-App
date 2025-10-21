import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApplications() {
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    const applicant_id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:5000/myapplications/${applicant_id}`)
      .then((res) => res.json())
      .then((data) => setMyApplications(data))
      .catch((err) => console.error(err));
  }, []);

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
