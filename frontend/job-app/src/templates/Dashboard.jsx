import YourJobs from "./YourJobs";
import CandidateList from "./CandidateList";
import MyApplications from "./MyApplications";
import Navbar from "./Navbar";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchUserProfile, fetchEmployerJobs, fetchApplicationsByEmployer } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES } from "../utils/constants";
import { SkeletonStatCard } from "../components/SkeletonLoader";

function Dashboard({ onLogout }) {
  const [hasJobs, setHasJobs] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);

  // Fetch minimal info to decide if employer has jobs
  useEffect(() => {
    const loadEmployerJobs = async () => {
      try {
        const employer_id = getCurrentUserId();
        if (!employer_id) return;
        
        const data = await fetchEmployerJobs(employer_id);
        setHasJobs(Array.isArray(data) && data.length > 0);
      } catch (err) {
        setHasJobs(false);
        console.error("Error loading employer jobs:", err);
      }
    };

    loadEmployerJobs();
  }, [refreshKey]);

  // Fetch profile summary for hero + stats
  const fetchProfile = useCallback(async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setError(ERROR_MESSAGES.LOGIN_REQUIRED);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchUserProfile(userId);
      setProfile(data);
      
      // Also update hasJobs based on profile counts for immediate UX
      if (data?.counts) {
        setHasJobs((data.counts.jobs_posted || 0) > 0);
      }
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  // Fetch number of candidates (applications received) only if user has posted jobs
  useEffect(() => {
    const loadCandidates = async () => {
      if (!hasJobs) {
        setCandidateCount(0);
        return;
      }
      
      try {
        const employerId = getCurrentUserId();
        if (!employerId) return;
        
        const apps = await fetchApplicationsByEmployer(employerId);
        setCandidateCount(Array.isArray(apps) ? apps.length : 0);
      } catch (err) {
        setCandidateCount(0);
        console.error("Error loading candidates:", err);
      }
    };

    loadCandidates();
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
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Navbar onLogout={onLogout} />
      <main id="main-content" className="dashboard-container">
        <div className="container mt-4">
        {/* Hero Header */}
        <header
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
                aria-hidden="true"
              >
                <span className="fw-bold" style={{ fontSize: 20 }}>{initials}</span>
              </div>
              <div>
                <h1 className="h4 mb-1">Dashboard</h1>
                <p className="small opacity-75 mb-0">Manage your jobs and applications in one place</p>
              </div>
            </div>
            <nav className="d-flex gap-2" aria-label="Dashboard actions">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={loading}
                aria-label={loading ? "Refreshing dashboard data" : "Refresh dashboard data"}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true"></span>
                    <span className="ms-2">Refreshing...</span>
                  </>
                ) : (
                  "Refresh"
                )}
              </button>
              <a className="btn btn-outline-light btn-sm" href="/create-job">
                Post a Job
              </a>
              <a className="btn btn-outline-light btn-sm" href="/">
                Browse Jobs
              </a>
            </nav>
          </div>
        </header>

        {loading && (
          <div className="alert alert-info" role="status" aria-live="polite">
            <span className="spinner spinner-primary me-2" aria-hidden="true"></span>
            Loading dashboard...
          </div>
        )}
        
        {error && !loading && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            <span>{error}</span>
            <button className="btn btn-sm btn-light" onClick={fetchProfile}>
              Retry
            </button>
          </div>
        )}

        {loading && !profile ? (
          <div className="row g-3 mb-4" aria-hidden="true">
            <div className="col-lg-3">
              <SkeletonStatCard />
            </div>
            <div className="col-lg-3">
              <SkeletonStatCard />
            </div>
            <div className="col-lg-3">
              <SkeletonStatCard />
            </div>
            <div className="col-lg-3">
              <SkeletonStatCard />
            </div>
          </div>
        ) : profile && (
          <section className="row g-3 mb-4" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
            <div className={hasJobs ? "col-lg-3" : "col-lg-4"}>
              <div className="card stat-card shadow-sm h-100 border-0">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                      style={{ width: 56, height: 56 }}
                    >
                      <span className="fw-bold">{initials}</span>
                    </div>
                  </div>
                  <h5 className="card-title mb-0 stat-label">{profile.user.username}</h5>
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
          </section>
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
      </main>
    </>
  );
}

export default Dashboard;
