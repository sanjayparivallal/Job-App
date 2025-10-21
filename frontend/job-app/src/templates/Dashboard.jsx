import YourJobs from "./YourJobs";
import CandidateList from "./CandidateList";
import MyApplications from "./MyApplications";
import Navbar from "./Navbar";

function Dashboard({ onLogout }) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Welcome to your Dashboard</h2>
          <p>Manage your job applications and profile here.</p>
        </div>

        <div className="container">
          <div className="dashboard-section">
            <YourJobs />
          </div>
          <div className="dashboard-section">
            <CandidateList />
          </div>
          <div className="dashboard-section">
            <MyApplications />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
