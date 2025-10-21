import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Apply() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState("");  // 🆕 job title state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  // 🆕 Fetch job title using jobId
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/jobs`)
      .then(res => {
        const job = res.data.find(j => String(j.id) === String(jobId));
        if (job) setJobTitle(job.title);
      })
      .catch(err => console.error("Error fetching job title:", err));
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const applicant_id = localStorage.getItem("user_id");
    
    if (!applicant_id) {
      alert("You must be logged in to apply!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/apply", {
        job_id: jobId,
        applicant_id,
        full_name: fullName,
        email,
        phone,
        education,
        experience,
        skills
      });

      alert(response.data.message);
      navigate('/'); // Redirect to home page after successful application
    } catch (error) {
      alert(error.response?.data?.error || "Failed to submit application");
    }
  }

  return (
    <>
      <Navbar />
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
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Apply;
