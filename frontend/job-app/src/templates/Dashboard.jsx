import YourJobs from "./YourJobs";
import CandidateList from "./CandidateList";
import MyApplications from "./MyApplications";
import Navbar from "./Navbar";
import { useState, useEffect, useCallback, useMemo } from "react";

function Dashboard({ onLogout }) {
  const [hasJobs, setHasJobs] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);

  // Fetch minimal info to decide if employer has jobs
  useEffect(() => {
    const employer_id = localStorage.getItem("user_id");
    fetch(`http://127.0.0.1:5000/showemployerjobs/${employer_id}`)
      .then((res) => res.json())
      .then((data) => setHasJobs(Array.isArray(data) && data.length > 0))
      .catch(() => setHasJobs(false));
  }, [refreshKey]);

  // Fetch profile summary for hero + stats
  const fetchProfile = useCallback(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("You must be logged in to view your dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    fetch(`http://127.0.0.1:5000/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        // Also update hasJobs based on profile counts for immediate UX
        if (data?.counts) {
          setHasJobs((data.counts.jobs_posted || 0) > 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  // Fetch number of candidates (applications received) only if user has posted jobs
  useEffect(() => {
    if (!hasJobs) {
      setCandidateCount(0);
      return;
    }
    const employerId = localStorage.getItem("user_id");
    if (!employerId) return;
    fetch(`http://127.0.0.1:5000/applications/${employerId}`)
      .then((res) => res.json())
      .then((apps) => setCandidateCount(Array.isArray(apps) ? apps.length : 0))
      .catch(() => setCandidateCount(0));
  }, [hasJobs, refreshKey]);

  const initials = useMemo(() => {
    const name = profile?.user?.username || "";
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [profile]);

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="dashboard-container">
        <div className="container mt-4">
        {/* Hero Header */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,110,253,0.9) 0%, rgba(111,66,193,0.9) 100%)",
          }}
        >
          <div className="card-body text-white d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 64, height: 64, background: "rgba(255,255,255,0.2)" }}
              >
                <span className="fw-bold" style={{ fontSize: 20 }}>{initials}</span>
              </div>
              <div>
                <h2 className="h4 mb-1">Dashboard</h2>
                <div className="small opacity-75">Manage your jobs and applications in one place</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <a className="btn btn-outline-light btn-sm" href="/create-job">Post a Job</a>
              <a className="btn btn-outline-light btn-sm" href="/">Browse Jobs</a>
            </div>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading dashboard...</div>}
        {error && !loading && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-light" onClick={fetchProfile}>Retry</button>
          </div>
        )}

        {profile && (
          <div className="row g-3 mb-4">
            <div className={hasJobs ? "col-lg-3" : "col-lg-4"}>
              <div className="card stat-card shadow-sm h-100 border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                      style={{ width: 56, height: 56 }}
                    >
                      <span className="fw-bold">{initials}</span>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">{profile.user.username}</h5>
                      <small className="text-muted">User ID: {profile.user.user_id}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={hasJobs ? "col-6 col-lg-3" : "col-lg-4"}>
              <div className="card stat-card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <div className="stat-number mb-0">{profile.counts.jobs_posted}</div>
                  <div className="stat-label small">Jobs Posted</div>
                </div>
              </div>
            </div>
            <div className={hasJobs ? "col-6 col-lg-3" : "col-lg-4"}>
              <div className="card stat-card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <div className="stat-number mb-0">{profile.counts.applications_submitted}</div>
                  <div className="stat-label small">Applications</div>
                </div>
              </div>
            </div>
            {hasJobs && (
              <div className="col-6 col-lg-3">
                <div className="card stat-card shadow-sm h-100 border-0">
                  <div className="card-body text-center">
                    <div className="stat-number mb-0">{candidateCount}</div>
                    <div className="stat-label small">Candidates</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Core sections */}
        {hasJobs && (
          <>
            <div className="dashboard-section">
              <YourJobs key={`yj-${refreshKey}`} />
            </div>
            <div className="dashboard-section">
              <CandidateList key={`cl-${refreshKey}`} />
            </div>
          </>
        )}
        <div className="dashboard-section">
          <MyApplications key={`ma-${refreshKey}`} />
        </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
