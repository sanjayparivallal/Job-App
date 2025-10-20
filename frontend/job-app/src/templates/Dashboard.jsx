import YourJobs from "./YourJobs";
import CandidateList from "./CandidateList";
import MyApplications from "./MyApplications";
import Navbar from "./Navbar";

function Dashboard({ onLogout }) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="container mt-4">
        <div>
          <h2 className="text-center mt-4">Welcome to your Dashboard</h2>
          <p className="text-center">Manage your job applications and profile here.</p>
        </div>
        <YourJobs />
        <CandidateList />
        <MyApplications />
      </div>
    </>
  );
}

export default Dashboard;
