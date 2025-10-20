import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Dashboard() {
  const [currentJob, setCurrentJob] = useState([])
  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:5000/showemployerjobs${employer_id}`)
      .then(res => res.json())
      .then(data => setCurrentJob(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <div>
          <h2 className="text-center mt-4">Welcome to your Dashboard</h2>
          <p className="text-center">Manage your job applications and profile here.</p>
        </div>
        <div>
          <h2>Your jobs</h2>
          {currentJob.map((job) => (
            <div key={job.id} className="list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm">
              {/* Job Details */}
              <div>
                <h5>{job.title}</h5>
                <p className="mb-1"><strong>Description:</strong> {job.description}</p>
                <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                <p className="mb-0"><strong>Salary:</strong> {job.salary}</p>
              </div>
              {/* delete Button */}
              <button className="btn btn-primary">Delete</button>
            </div>
          ))}

        </div>
        <div>
          <h2>Candidate List</h2>
        </div>
        <div>
          <h2>My Applications</h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
