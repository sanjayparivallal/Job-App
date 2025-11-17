import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../app.css"; 
import { fetchAllJobs } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { useDebounce } from "../hooks/useDebounce";
import { SkeletonJobCard } from "../components/SkeletonLoader";

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterLocation, setFilterLocation] = useState("");
  const navigate = useNavigate();
  
  // Debounce search input for better performance
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentUserId = getCurrentUserId();
        const data = await fetchAllJobs();
        
        // Filter out jobs where the employer_id matches the current user's id
        const availableJobs = currentUserId 
          ? data.filter(job => String(job.employer_id) !== currentUserId)
          : data;
        setJobs(availableJobs);
      } catch (err) {
        setError(err.message || "Failed to load jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs based on debounced search input
  const filteredJobs = jobs.filter(job => {
    const q = debouncedSearch.toLowerCase();
    const matchesSearch = (
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
    
    const matchesLocation = filterLocation === "" || 
      job.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.id || 0) - (a.id || 0); // Assuming higher ID = newer
      case "oldest":
        return (a.id || 0) - (b.id || 0);
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "salary-high":
        // Extract numeric value from salary string
        const salaryA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
        const salaryB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
        return salaryB - salaryA;
      case "salary-low":
        const salA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
        const salB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
        return salA - salB;
      default:
        return 0;
    }
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(jobs.map(job => job.location))].sort();

  return (
    <div className="job-search-container">
      <h2 className="text-center mb-4">Search your next opportunity...</h2>
  
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <label htmlFor="job-search-input" className="sr-only">
            Search for jobs by title, description, or location
          </label>
          
          {/* Mobile: Stacked layout */}
          <div className="d-md-none mb-3">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: '1.2rem' }}>
                🔍
              </span>
              <input 
                id="job-search-input"
                type="text" 
                className="form-control ps-5 mb-2" 
                placeholder="Search for jobs..."
                aria-label="Search for jobs"
                aria-describedby="search-help"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary w-100" 
              type="button" 
              onClick={() => setSearch("")}
              aria-label="Clear search"
              disabled={!search}
            >
              Clear Search
            </button>
          </div>

          {/* Desktop: Inline layout */}
          <div className="input-group mb-3 d-none d-md-flex">
            <span className="input-group-text bg-white">🔍</span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search for jobs..."
              aria-label="Search for jobs"
              aria-describedby="search-help"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={() => setSearch("")}
              aria-label="Clear search"
              disabled={!search}
            >
              Clear
            </button>
          </div>

          <small id="search-help" className="sr-only">
            Enter keywords to search for jobs. Results update automatically as you type.
          </small>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="location-filter" className="form-label small fw-bold">
                Filter by Location
              </label>
              <select 
                id="location-filter"
                className="form-select"
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                aria-label="Filter jobs by location"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="sort-by" className="form-label small fw-bold">
                Sort By
              </label>
              <select 
                id="sort-by"
                className="form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort jobs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="salary-high">Salary (High to Low)</option>
                <option value="salary-low">Salary (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <h1 className="mb-4 text-center">
        Jobs Available
        {!loading && (
          <span className="badge bg-primary ms-2" style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
            {sortedJobs.length}
          </span>
        )}
      </h1>

      <div className="list-group" role="list" aria-live="polite" aria-atomic="true">
        {loading ? (
          // Show skeleton loaders while loading
          <>
            <SkeletonJobCard />
            <SkeletonJobCard />
            <SkeletonJobCard />
          </>
        ) : error ? (
          <div className="text-center p-4 text-danger" role="alert">
            <p>{error}</p>
            <button 
              className="btn btn-primary mt-2" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="text-center p-4" role="status">
            <div className="mb-3" style={{ fontSize: '3rem' }}>😕</div>
            <h3 className="text-muted mb-2">No jobs found</h3>
            {search || filterLocation ? (
              <p className="text-muted">
                Try adjusting your search or filters
              </p>
            ) : (
              <p className="text-muted">No jobs available right now.</p>
            )}
            {(search || filterLocation) && (
              <button 
                className="btn btn-outline-primary mt-3"
                onClick={() => {
                  setSearch("");
                  setFilterLocation("");
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          sortedJobs.map((job) => (
            <article 
              key={job.id} 
              className="list-group-item"
              role="listitem"
            >
              <div>
                <h5>{job.title}</h5>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate(`/apply/${job.id}`)}
                aria-label={`Apply for ${job.title} position`}
              >
                Apply
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default JobSearch;
