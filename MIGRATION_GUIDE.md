# Component Development Guide

This guide demonstrates best practices and patterns for building components with proper API integration, accessibility, and loading states.

---

## � CandidateList Component Pattern

### **Data Fetching Implementation:**

```jsx
// Replace the existing useEffect with:
useEffect(() => {
  const loadCandidates = async () => {
    const employerId = getCurrentUserId();
    
    if (!employerId) {
      setHasJobs(false);
      setLoading(false);
      setError(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const jobs = await fetchEmployerJobs(employerId);
      const has = Array.isArray(jobs) && jobs.length > 0;
      setHasJobs(has);

      if (has) {
        const apps = await fetchApplicationsByEmployer(employerId);
        setApplications(Array.isArray(apps) ? apps : []);
      }
    } catch (err) {
      console.error("Error loading candidates:", err);
      setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
      setHasJobs(false);
    } finally {
      setLoading(false);
    }
  };

  loadCandidates();
}, []);

// Update the loading state return:
if (loading) {
  return (
    <section className="candidate-list-container dashboard-section" aria-labelledby="candidates-heading">
      <h2 id="candidates-heading" className="fw-bold text-center mb-4 border-bottom pb-2 text-primary dashboard-header">
        Candidate List
      </h2>
      <div aria-live="polite" aria-busy="true">
        {[1, 2].map(i => <SkeletonCard key={i} />)}
      </div>
    </section>
  );
}

// Add error state:
if (error) {
  return (
    <section className="candidate-list-container dashboard-section" aria-labelledby="candidates-heading">
      <h2 id="candidates-heading" className="fw-bold text-center mb-4 border-bottom pb-2 text-primary dashboard-header">
        Candidate List
      </h2>
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </section>
  );
}

// Update the main return to use semantic HTML and ARIA:
return (
  <section className="candidate-list-container dashboard-section" aria-labelledby="candidates-heading">
    <h2 id="candidates-heading" className="fw-bold text-center mb-4 border-bottom pb-2 text-primary dashboard-header">
      Candidate List
    </h2>

    {applications.length === 0 ? (
      <p className="text-muted text-center mt-4">
        No candidates have applied yet.
      </p>
    ) : (
      <div role="list">
        {applications.map((application) => (
          <article
            key={application.application_id}
            className="candidate-card list-group-item mb-3 shadow-sm p-3 rounded d-flex justify-content-between align-items-center"
            role="listitem"
            aria-labelledby={`candidate-name-${application.application_id}`}
          >
            <div className="flex-grow-1">
              <h3 id={`candidate-name-${application.application_id}`} className="h5 mb-1">
                {application.full_name}
              </h3>
              <small className="text-secondary d-block mb-2">
                Applied for:{" "}
                <strong className="job-title text-primary">
                  {application.job_title}
                </strong>
              </small>

              <p className="mb-1 small">
                <strong>Email:</strong> {application.email} &nbsp; | &nbsp;
                <strong>Phone:</strong> {application.phone}
              </p>
              <p className="mb-1 small">
                <strong>Education:</strong> {application.education || "N/A"} &nbsp; | &nbsp;
                <strong>Experience:</strong> {application.experience || "N/A"}
              </p>
              <p className="mb-0 small">
                <strong>Skills:</strong> {application.skills || "N/A"}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 gap-md-3">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAccept(application)}
                disabled={processingId === application.application_id}
                aria-label={`Accept application from ${application.full_name}`}
              >
                {processingId === application.application_id ? (
                  <>
                    <span className="spinner spinner-sm" aria-hidden="true"></span>
                    <span className="ms-1">Processing...</span>
                  </>
                ) : (
                  "Accept"
                )}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleReject(application.application_id)}
                disabled={processingId === application.application_id}
                aria-label={`Reject application from ${application.full_name}`}
              >
                {processingId === application.application_id ? (
                  <>
                    <span className="spinner spinner-sm" aria-hidden="true"></span>
                    <span className="ms-1">Processing...</span>
                  </>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
);
```

---

## � MyApplications Component Pattern

### **Application Tracking Implementation:**

```jsx
import React, { useState, useEffect } from "react";
import { fetchApplicationsByApplicant } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES } from "../utils/constants";
import { SkeletonCard } from "../components/SkeletonLoader";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      const userId = getCurrentUserId();
      
      if (!userId) {
        setError(ERROR_MESSAGES.LOGIN_REQUIRED);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await fetchApplicationsByApplicant(userId);
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return (
      <section className="my-applications-container" aria-labelledby="my-apps-heading">
        <h2 id="my-apps-heading">My Applications</h2>
        <div aria-live="polite" aria-busy="true">
          {[1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-applications-container" aria-labelledby="my-apps-heading">
        <h2 id="my-apps-heading">My Applications</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="my-applications-container" aria-labelledby="my-apps-heading">
      <h2 id="my-apps-heading">My Applications</h2>
      
      {applications.length === 0 ? (
        <p className="text-muted text-center mt-4">
          You haven't applied to any jobs yet.
        </p>
      ) : (
        <div role="list">
          {applications.map((app) => (
            <article
              key={app.application_id}
              className="application-card"
              role="listitem"
              aria-labelledby={`app-job-${app.application_id}`}
            >
              <h3 id={`app-job-${app.application_id}`} className="h5">
                {app.job_title}
              </h3>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyApplications;
```

---

## � JobForm Component Pattern

### **Job Creation Form Implementation:**

```jsx
import React, { useState } from "react";
import { createJob } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function JobForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.location || !formData.salary) {
      setError("All fields are required");
      return;
    }

    const employerId = getCurrentUserId();
    if (!employerId) {
      setError(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await createJob({
        ...formData,
        employer_id: employerId
      });

      alert(SUCCESS_MESSAGES.JOB_CREATED || "Job posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="job-form-container" aria-labelledby="create-job-heading">
      <h2 id="create-job-heading">Post a New Job</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label="Create job posting form">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Job Title <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description <span className="text-danger" aria-label="required">*</span>
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="salary" className="form-label">
            Salary <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label={loading ? "Creating job posting..." : "Create job posting"}
        >
          {loading ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true"></span>
              <span className="ms-2">Creating...</span>
            </>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </section>
  );
}

export default JobForm;
```

---

## � Apply Component Pattern

### **Application Submission Implementation:**

```jsx
import React, { useState } from "react";
import { submitApplication } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { useParams, useNavigate } from "react-router-dom";

function Apply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name || !formData.email || !formData.phone) {
      setError("Name, email, and phone are required");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      setError(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await submitApplication({
        ...formData,
        user_id: userId,
        job_id: jobId
      });

      alert(SUCCESS_MESSAGES.APPLICATION_SUBMITTED || "Application submitted!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="apply-container" aria-labelledby="apply-heading">
      <h2 id="apply-heading">Apply for Job</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label="Job application form">
        <div className="mb-3">
          <label htmlFor="full_name" className="form-label">
            Full Name <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone <span className="text-danger" aria-label="required">*</span>
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="education" className="form-label">
            Education
          </label>
          <input
            type="text"
            className="form-control"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="experience" className="form-label">
            Experience
          </label>
          <textarea
            className="form-control"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="skills" className="form-label">
            Skills
          </label>
          <textarea
            className="form-control"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label={loading ? "Submitting application..." : "Submit application"}
        >
          {loading ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true"></span>
              <span className="ms-2">Submitting...</span>
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </section>
  );
}

export default Apply;
```

---

## � LoginSignup Component Pattern

### **Authentication Implementation:**

```jsx
import React, { useState } from "react";
import { loginUser, signupUser } from "../utils/api";
import { setCurrentUser, LOCAL_STORAGE_KEYS } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES } from "../utils/constants";

function LoginSignup({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "applicant"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    if (!isLogin && !formData.email) {
      setError("Email is required for signup");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      let response;
      if (isLogin) {
        response = await loginUser({
          username: formData.username,
          password: formData.password
        });
      } else {
        response = await signupUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }

      // Store user data
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ID, response.user_id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERNAME, response.username);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, response.role);

      onLogin();
    } catch (err) {
      setError(err.message || (isLogin ? "Login failed" : "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-signup-container" aria-labelledby="auth-heading">
      <h2 id="auth-heading">{isLogin ? "Login" : "Sign Up"}</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} aria-label={isLogin ? "Login form" : "Sign up form"}>
        {/* Form fields... */}
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-label={loading ? "Processing..." : (isLogin ? "Log in" : "Sign up")}
        >
          {loading ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true"></span>
              <span className="ms-2">Processing...</span>
            </>
          ) : (
            isLogin ? "Login" : "Sign Up"
          )}
        </button>
      </form>

      <button
        className="btn btn-link"
        onClick={() => setIsLogin(!isLogin)}
        aria-label={isLogin ? "Switch to sign up" : "Switch to login"}
      >
        {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
    </section>
  );
}

export default LoginSignup;
```

---

## ✅ Component Development Checklist

When building a component, ensure you include:

1. **Imports:**
   - [ ] Import API functions from `../utils/api`
   - [ ] Import `getCurrentUserId` from `../hooks/useLocalStorage`
   - [ ] Import constants from `../utils/constants`
   - [ ] Import skeleton loaders from `../components/SkeletonLoader`

2. **State Management:**
   - [ ] Add `loading` state
   - [ ] Add `error` state
   - [ ] Add loading states for buttons (`processingId`, `submitting`, etc.)

3. **Data Fetching:**
   - [ ] Use API layer functions instead of direct `fetch()`
   - [ ] Use `getCurrentUserId()` for user identification
   - [ ] Implement try-catch error handling
   - [ ] Properly set loading states in try-finally blocks

4. **Loading States:**
   - [ ] Show skeleton loaders during initial load
   - [ ] Show spinners on action buttons
   - [ ] Disable buttons during loading
   - [ ] Add `aria-busy` for screen readers

5. **Error Handling:**
   - [ ] Display user-friendly error messages
   - [ ] Use error constants from `utils/constants`
   - [ ] Add retry functionality where appropriate
   - [ ] Use `role="alert"` for error messages

6. **Accessibility:**
   - [ ] Use semantic HTML (`<section>`, `<article>`, `<nav>`)
   - [ ] Add ARIA labels to all interactive elements
   - [ ] Add `aria-labelledby` for section headings
   - [ ] Add `aria-live` for dynamic content
   - [ ] Ensure proper heading hierarchy (h1, h2, h3)
   - [ ] Add `required` and `aria-required` to form fields
   - [ ] Use `<label>` elements properly

7. **Optimistic UI:**
   - [ ] Implement optimistic updates for better UX
   - [ ] Show immediate feedback on user actions
   - [ ] Handle rollback on errors

8. **Testing:**
   - [ ] Test with keyboard navigation
   - [ ] Test with screen reader
   - [ ] Test loading states
   - [ ] Test error scenarios
   - [ ] Test on mobile devices

---

## 💡 Development Best Practices

1. **Use semantic HTML** - Improves accessibility and SEO automatically
2. **Implement loading states** - Users should always know the application status
3. **Handle errors gracefully** - Display user-friendly messages, not console errors
4. **Utilize constants** - Avoid hardcoded strings for maintainability
5. **Test with keyboard only** - Ensures accessibility for all users
6. **Apply ARIA labels thoughtfully** - Enhance but don't replace semantic HTML

---

## 🎯 Component Implementation Priority

Components are organized by functionality and complexity:

1. **CandidateList.jsx** - Application review and management
2. **MyApplications.jsx** - User application tracking
3. **JobForm.jsx** - Job posting creation
4. **Apply.jsx** - Application submission
5. **LoginSignup.jsx** - User authentication

---

## 📚 Additional Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated:** November 2025  
**Version:** 2.0.0
