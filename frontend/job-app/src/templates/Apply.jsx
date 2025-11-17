import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchAllJobs, submitApplicationWithResume } from "../utils/api";
import 'bootstrap/dist/css/bootstrap.min.css';

function Apply({ onLogout }) {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState("");  // 🆕 job title state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🆕 Fetch job title using jobId
  useEffect(() => {
    fetchAllJobs()
      .then(data => {
        const job = data.find(j => String(j.id) === String(jobId));
        if (job) setJobTitle(job.title);
      })
      .catch(err => console.error("Error fetching job title:", err));
  }, [jobId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        e.target.value = null;
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = null;
        return;
      }
      setResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const applicant_id = localStorage.getItem("user_id");
    
    if (!applicant_id) {
      toast.error("You must be logged in to apply!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("job_id", jobId);
      formData.append("applicant_id", applicant_id);
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("education", education);
      formData.append("experience", experience);
      formData.append("skills", skills);
      if (resume) {
        formData.append("resume", resume);
      }

      await submitApplicationWithResume(formData);
      toast.success("Application submitted successfully! 🎉");
      navigate('/'); // Redirect to home page after successful application
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="container mt-4">
        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "700px" }}>
          {/* 🆕 Job Title Display */}
          <h2 className="text-center mb-2 text-primary">
            {jobTitle || "Loading..."}
          </h2>

          <h4 className="text-center mb-4">Job Application Form</h4>
          <form onSubmit={handleSubmit} className="needs-validation">
            <div className="row g-3">
              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <label htmlFor="fullname">Full Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Email Address</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <label htmlFor="phone">Phone Number</label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="education"
                    placeholder="Your Education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                  />
                  <label htmlFor="education">Education</label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="experience"
                    placeholder="Your Experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={{ height: "100px" }}
                    required
                  />
                  <label htmlFor="experience">Work Experience</label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating mb-4">
                  <textarea
                    className="form-control"
                    id="skills"
                    placeholder="Your Skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    style={{ height: "100px" }}
                    required
                  />
                  <label htmlFor="skills">Skills</label>
                </div>
              </div>

              <div className="col-12">
                <div className="mb-4">
                  <label htmlFor="resume" className="form-label">
                    Upload Resume <span className="text-muted">(PDF, max 5MB)</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  {resume && (
                    <div className="mt-2 text-success">
                      ✓ {resume.name} ({(resume.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Apply;
