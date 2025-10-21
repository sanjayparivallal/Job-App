import YourJobs from "./YourJobs";
import CandidateList from "./CandidateList";
import MyApplications from "./MyApplications";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";

function Dashboard({ onLogout }) {
  const [hasJobs, setHasJobs] = useState(false);

  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then(res => res.json())
      .then(data => setHasJobs(Array.isArray(data) && data.length > 0))
      .catch(err => setHasJobs(false));
  }, []);

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Welcome to your Dashboard</h2>
          <p>Manage your job applications and profile here.</p>
        </div>

        <div className="container">
          {hasJobs && (
            <>
              <div className="dashboard-section">
                <YourJobs />
              </div>
              <div className="dashboard-section">
                <CandidateList />
              </div>
            </>
          )}
          <div className="dashboard-section">
            <MyApplications />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
