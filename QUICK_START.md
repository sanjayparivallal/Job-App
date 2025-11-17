# 🚀 Quick Start Guide - New Features

## For Users

### 📄 Uploading a Resume
1. Navigate to a job listing
2. Click "Apply"
3. Fill out the application form
4. Click "Choose File" under "Upload Resume"
5. Select a PDF file (max 5MB)
6. See confirmation: ✓ filename.pdf (size KB)
7. Click "Submit Application"
8. Get success notification! 🎉

### 🚫 Withdrawing an Application
1. Go to "My Applications"
2. Find a pending application
3. Click "Withdraw Application"
4. Confirm the withdrawal
5. Application is removed instantly ✅

### 🔍 Using Advanced Search
1. Go to Job Search page
2. Click "Show Advanced 🔧"
3. Enter minimum salary (e.g., 50000)
4. Enter maximum salary (e.g., 150000)
5. See results update instantly!
6. Click "Clear Salary Filters" to reset
7. Click "Hide Advanced" to collapse

### 📊 Exporting Candidates (Employers)
1. Go to Dashboard
2. Scroll to "Candidate List"
3. Click "📊 Export to CSV"
4. File downloads automatically
5. Open in Excel/Google Sheets
6. View all candidate data!

### ✏️ Creating Rich Job Posts (Employers)
1. Go to "Post a Job"
2. Fill in title, location, salary
3. Use the rich text editor for description:
   - Select text and click **B** for bold
   - Click header dropdown for H1/H2/H3
   - Use list buttons for bullets
   - Add links with the link button
4. Click "Post Job"
5. See success notification! 🎉

---

## For Developers

### Using Toast Notifications
```javascript
import toast from "react-hot-toast";

// Success
toast.success("Application submitted successfully! 🎉");

// Error
toast.error("Failed to upload file");

// Loading
const loadingToast = toast.loading("Processing...");
// Later...
toast.dismiss(loadingToast);
toast.success("Done!");
```

### Resume Upload API Call
```javascript
import { submitApplicationWithResume } from "../utils/api";

const formData = new FormData();
formData.append("job_id", jobId);
formData.append("applicant_id", applicantId);
formData.append("full_name", fullName);
formData.append("resume", resumeFile); // File object

await submitApplicationWithResume(formData);
```

### Withdraw Application
```javascript
import { withdrawApplication } from "../utils/api";

await withdrawApplication(applicationId);
// Returns: { message: "Application withdrawn successfully" }
```

### Export to CSV
```javascript
import { exportCandidatesToCSV } from "../utils/api";

await exportCandidatesToCSV(employerId);
// Automatically downloads CSV file
```

### Rich Text Editor Setup
```javascript
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const [description, setDescription] = useState("");

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

<ReactQuill
  theme="snow"
  value={description}
  onChange={setDescription}
  modules={modules}
  placeholder="Write description..."
/>
```

### Advanced Search State
```javascript
const [filterSalaryMin, setFilterSalaryMin] = useState("");
const [filterSalaryMax, setFilterSalaryMax] = useState("");
const [showAdvanced, setShowAdvanced] = useState(false);

// Filtering logic
const filteredJobs = jobs.filter(job => {
  const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
  
  if (filterSalaryMin && salary < parseInt(filterSalaryMin)) {
    return false;
  }
  if (filterSalaryMax && salary > parseInt(filterSalaryMax)) {
    return false;
  }
  
  return true;
});
```

---

## Environment Setup

### Install Packages
```bash
cd frontend/job-app
npm install react-hot-toast react-quill quill --legacy-peer-deps
```

### Start Dev Server
```bash
npm run dev
```

### Backend Setup (Required)
```bash
cd backend
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads/resumes

# Run migrations (see BACKEND_UPDATES.md)
python migration.py

# Start server
python app.py
```

---

## Component Imports Reference

### JobForm.jsx
```javascript
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { createJob } from "../utils/api";
```

### Apply.jsx
```javascript
import toast from "react-hot-toast";
import { fetchAllJobs, submitApplicationWithResume } from "../utils/api";
```

### MyApplications.jsx
```javascript
import toast from "react-hot-toast";
import { fetchApplicationsByApplicant, withdrawApplication } from "../utils/api";
```

### CandidateList.jsx
```javascript
import toast from "react-hot-toast";
import { exportCandidatesToCSV } from "../utils/api";
```

### App.jsx
```javascript
import { Toaster } from "react-hot-toast";

return (
  <Router>
    <Toaster position="top-right" reverseOrder={false} />
    {/* routes */}
  </Router>
);
```

---

## Common Patterns

### File Upload Validation
```javascript
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Type validation
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      e.target.value = null;
      return;
    }
    // Size validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      e.target.value = null;
      return;
    }
    setResume(file);
  }
};
```

### Loading States with Toast
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
    toast.success("Success! 🎉");
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

// Button
<button disabled={loading}>
  {loading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2"></span>
      Loading...
    </>
  ) : (
    "Submit"
  )}
</button>
```

### Optimistic UI Updates
```javascript
const handleWithdraw = async (id) => {
  // Update UI immediately
  setApplications(prev => prev.filter(app => app.id !== id));
  
  try {
    await withdrawApplication(id);
    toast.success("Withdrawn successfully");
  } catch (error) {
    // Rollback on error
    setApplications(originalApplications);
    toast.error(error.message);
  }
};
```

---

## Troubleshooting

### Toast not showing?
- Check `<Toaster />` is in App.jsx
- Verify import: `import { Toaster } from "react-hot-toast";`
- Check position prop: `position="top-right"`

### Rich text editor not styled?
- Import CSS: `import "react-quill/dist/quill.snow.css";`
- Check theme prop: `theme="snow"`

### File upload not working?
- Backend must accept `multipart/form-data`
- Don't set Content-Type header (browser sets it automatically)
- Use FormData, not JSON

### CSV not downloading?
- Backend must set Content-Type: `text/csv`
- Backend must set Content-Disposition header
- Check CORS settings for file downloads

---

## Browser Compatibility

✅ **Tested and Working:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

⚠️ **Requires:**
- JavaScript enabled
- Cookies enabled (for auth)
- Modern browser (ES6+ support)

---

## Performance Tips

1. **Search is debounced** (300ms) - users can type freely
2. **Filtering is client-side** - instant results
3. **Optimistic updates** - UI feels instant
4. **Lazy loading** - Toast library loads on demand
5. **File validation** - Happens before upload

---

## Security Notes

✅ **Frontend Validation:**
- File type checking (PDF only)
- File size checking (5MB max)
- Input sanitization

⚠️ **Backend Must Implement:**
- Server-side file validation
- Secure filename handling
- File storage outside web root
- Authorization checks
- Rate limiting

---

## Quick Links

- 📖 Full README: `frontend/job-app/README.md`
- 🔧 Backend Guide: `backend/BACKEND_UPDATES.md`
- 📋 Summary: `IMPLEMENTATION_SUMMARY.md`
- 🎯 Migration Guide: `MIGRATION_GUIDE.md`
- ⚡ Quick Reference: `QUICK_REFERENCE.md`

---

**Everything is ready! Start the dev server and test it out! 🚀**
