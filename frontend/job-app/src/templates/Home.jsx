import Navbar from "./Navbar";
import JobSearch from "./JobSearch";
import Dashboard from "./Dashboard";
import Createjob from "./Createjob";

function Home({ onLogout }) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="dashboard-container">
        <Createjob />
        <JobSearch />
      </div>
    </>
  );
}

export default Home;
