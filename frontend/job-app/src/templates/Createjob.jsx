import { useNavigate } from "react-router-dom";

function Createjob() {
  const navigate = useNavigate();
  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="d-flex flex-row align-items-center gap-4 border rounded p-4" style={{ margin: 0 }}>
        <div className="d-flex flex-column justify-content-center text-center">
          <h2>📝 Post a job and find the right talent.</h2>
          <h3 className="text-muted">💬 Post. Hire. Grow.</h3>
        </div>
        <button className="btn btn-success" style={{ height: "fit-content" }} onClick={() => navigate("/create-job")}>Create Job</button>
      </div>
    </div>
  );
}
export default Createjob;