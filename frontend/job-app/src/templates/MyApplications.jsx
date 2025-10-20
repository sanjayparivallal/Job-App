import { useEffect, useState } from "react";

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
    <div>
      <h2>My Applications</h2>
      <div className="list-group">
        {myApplications.length === 0 ? (
          <p className="text-muted">You have not applied to any jobs yet.</p>
        ) : (
          myApplications.map((app) => (
            <div
              key={app.application_id}
              className="list-group-item mb-3 shadow-sm"
            >
              <h5 className="mb-1">{app.job_title}</h5>
              <p className="mb-1">
                <strong>Description:</strong> {app.description}
              </p>
              <p className="mb-1">
                <strong>Location:</strong> {app.location}
              </p>
              <p className="mb-1">
                <strong>Salary:</strong> {app.salary}
              </p>
              <p className="mb-1">
                <strong>Education:</strong> {app.education || "N/A"} &nbsp; | &nbsp;
                <strong>Experience:</strong> {app.experience || "N/A"}
              </p>
              <p className="mb-1">
                <strong>Skills:</strong> {app.skills || "N/A"}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {app.email} &nbsp; | &nbsp;
                <strong>Phone:</strong> {app.phone}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyApplications;
