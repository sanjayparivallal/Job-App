import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // 👈 make sure this import exists

function Createjob() {
  const navigate = useNavigate();

  return (
    <div className="create-job-container d-flex justify-content-center align-items-center">
      <div className="create-job-card d-flex flex-row align-items-center justify-content-between flex-wrap p-4 rounded-4 shadow">
        <div className="text-section text-center text-md-start">
          <h2 className="fw-bold text-dark">
            📝 Post a job and find the right talent.
          </h2>
          <h4 className="text-secondary">💬 Post. Hire. Grow.</h4>
        </div>

        <button
          className="btn create-btn px-4 py-2 rounded-pill fw-semibold shadow-sm"
          onClick={() => navigate("/create-job")}
        >
          + Create Job
        </button>
      </div>
    </div>
  );
}

export default Createjob;
