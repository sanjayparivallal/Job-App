# Developer Quick Reference

## 🚀 Architecture Components

### **API Layer** (`utils/api.js`)
```javascript
import { fetchAllJobs, createJob, deleteJob } from "../utils/api";
```

**Available Functions:**
- `fetchUserProfile(userId)` - Get user profile with stats
- `fetchAllJobs()` - Get all available jobs
- `createJob(jobData)` - Create new job posting
- `deleteJob(jobId)` - Delete job by ID
- `submitApplication(applicationData)` - Submit job application
- `fetchApplicationsByApplicant(userId)` - Get user's applications
- `fetchApplicationsByEmployer(employerId)` - Get applications for employer's jobs
- `fetchEmployerJobs(employerId)` - Get jobs posted by employer
- `updateApplicationStatus(applicationId, status)` - Accept/reject application
- `loginUser(credentials)` - User login
- `signupUser(userData)` - User registration

---

### **Custom Hooks**
```javascript
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { getCurrentUserId } from "../hooks/useLocalStorage";
```

**useFetch:**
```javascript
const { data, loading, error, refetch } = useFetch(fetchAllJobs);
```

**useDebounce:**
```javascript
const debouncedSearch = useDebounce(searchTerm, 300);
```

**useLocalStorage:**
```javascript
const userId = getCurrentUserId();
const username = getCurrentUsername();
const userRole = getCurrentUserRole();
```

---

### **Constants** (`utils/constants.js`)
```javascript
import { ERROR_MESSAGES, SUCCESS_MESSAGES, APPLICATION_STATUS } from "../utils/constants";
```

**APPLICATION_STATUS:**
- `PENDING: "pending"`
- `ACCEPTED: "accepted"`
- `REJECTED: "rejected"`

**LOCAL_STORAGE_KEYS:**
- `USER_ID: "user_id"`
- `USERNAME: "username"`
- `ROLE: "role"`

**ERROR_MESSAGES:**
- `LOGIN_REQUIRED: "You must be logged in"`
- `LOAD_FAILED: "Failed to load data"`
- `NETWORK_ERROR: "Network error"`

---

### **Skeleton Loaders** (`components/SkeletonLoader.jsx`)
```javascript
import { SkeletonCard, SkeletonJobCard, SkeletonStatCard } from "../components/SkeletonLoader";
```

**Usage:**
```jsx
{loading && (
  <div aria-live="polite" aria-busy="true">
    {[1, 2, 3].map(i => <SkeletonJobCard key={i} />)}
  </div>
)}
```

---

## 🎨 Component Development Patterns

### **Standard Component Structure**

```jsx
import React, { useState, useEffect } from "react";
import { fetchData } from "../utils/api";
import { getCurrentUserId } from "../hooks/useLocalStorage";
import { ERROR_MESSAGES } from "../utils/constants";
import { SkeletonCard } from "../components/SkeletonLoader";

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        setError(ERROR_MESSAGES.LOGIN_REQUIRED);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const result = await fetchData(userId);
        setData(result);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section aria-labelledby="heading">
        <h2 id="heading">My Component</h2>
        <div aria-live="polite" aria-busy="true">
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-labelledby="heading">
        <h2 id="heading">My Component</h2>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="heading">
      <h2 id="heading">My Component</h2>
      {/* Content */}
    </section>
  );
}

export default MyComponent;
```

---

### **Form Submission with Loading**

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.required_field) {
    setError("Required field is missing");
    return;
  }

  try {
    setLoading(true);
    setError("");
    await createSomething(formData);
    alert("Success!");
    navigate("/somewhere");
  } catch (err) {
    setError(err.message || "Operation failed");
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit} aria-label="Description">
    {/* Form fields */}
    
    <button
      type="submit"
      className="btn btn-primary"
      disabled={loading}
      aria-label={loading ? "Processing..." : "Submit"}
    >
      {loading ? (
        <>
          <span className="spinner spinner-sm" aria-hidden="true"></span>
          <span className="ms-2">Processing...</span>
        </>
      ) : (
        "Submit"
      )}
    </button>
  </form>
);
```

---

### **Button with Loading State**

```jsx
const [processingId, setProcessingId] = useState(null);

const handleAction = async (itemId) => {
  setProcessingId(itemId);
  try {
    await performAction(itemId);
    // Optimistic UI update
    setItems(prev => prev.filter(item => item.id !== itemId));
  } catch (err) {
    alert(err.message);
  } finally {
    setProcessingId(null);
  }
};

return (
  <button
    onClick={() => handleAction(item.id)}
    disabled={processingId === item.id}
    aria-label={`Action for ${item.name}`}
  >
    {processingId === item.id ? (
      <>
        <span className="spinner spinner-sm" aria-hidden="true"></span>
        <span className="ms-1">Processing...</span>
      </>
    ) : (
      "Action"
    )}
  </button>
);
```

---

## ♿ Accessibility Checklist

### **Semantic HTML**
```jsx
✅ <header>, <main>, <section>, <article>, <nav>
✅ <h1>, <h2>, <h3> (proper hierarchy)
✅ <button> for actions, <a> for links
✅ <label> for form fields
```

### **ARIA Attributes**
```jsx
✅ aria-label="Clear description"
✅ aria-labelledby="heading-id"
✅ aria-live="polite" (for dynamic content)
✅ aria-busy="true" (during loading)
✅ aria-required="true" (required fields)
✅ role="alert" (error messages)
✅ role="list" and role="listitem"
```

### **Form Accessibility**
```jsx
<label htmlFor="field-id">
  Field Name <span className="text-danger" aria-label="required">*</span>
</label>
<input
  id="field-id"
  name="field_name"
  required
  aria-required="true"
  aria-describedby="field-help"
/>
<small id="field-help">Help text</small>
```

### **Loading States**
```jsx
{loading && (
  <div aria-live="polite" aria-busy="true">
    <SkeletonCard />
  </div>
)}
```

### **Error Messages**
```jsx
{error && (
  <div className="alert alert-danger" role="alert">
    {error}
  </div>
)}
```

---

## 🎯 Environment Setup

### **.env File**
```env
VITE_API_URL=http://127.0.0.1:5000
NODE_ENV=development
```

### **Usage in Code**
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🧪 Testing Commands

### **Run Development Server**
```bash
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

---

## 📊 Component Feature Status

| Component | API Integration | Accessibility | Loading States | Error Handling |
|-----------|----------------|---------------|----------------|----------------|
| Dashboard.jsx | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |
| YourJobs.jsx | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |
| JobSearch.jsx | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete |
| CandidateList.jsx | ⚠️ In Progress | ⚠️ In Progress | ⚠️ In Progress | ⚠️ In Progress |
| MyApplications.jsx | 🔄 Planned | 🔄 Planned | 🔄 Planned | 🔄 Planned |
| JobForm.jsx | 🔄 Planned | 🔄 Planned | 🔄 Planned | 🔄 Planned |
| Apply.jsx | 🔄 Planned | 🔄 Planned | 🔄 Planned | 🔄 Planned |
| LoginSignup.jsx | 🔄 Planned | 🔄 Planned | 🔄 Planned | 🔄 Planned |

---

## 💡 Development Best Practices

1. **Handle all errors** - Display user-friendly messages for all failure scenarios
2. **Show application state** - Users need constant feedback on operations
3. **Apply semantic HTML** - Improves accessibility and SEO automatically
4. **Test keyboard navigation** - Ensure all functionality works without a mouse
5. **Use descriptive ARIA** - Make interactive elements clear for screen readers
6. **Centralize constants** - Maintain all magic strings in one location
7. **Implement optimistic UI** - Display changes immediately, handle errors gracefully
8. **Design mobile-first** - Start with mobile layout, enhance for larger screens

---

## 🔗 Useful Links

- **Project Documentation**: `/IMPROVEMENTS_SUMMARY.md`
- **Migration Guide**: `/MIGRATION_GUIDE.md`
- **API Utilities**: `/frontend/job-app/src/utils/api.js`
- **Constants**: `/frontend/job-app/src/utils/constants.js`
- **Custom Hooks**: `/frontend/job-app/src/hooks/`
- **Skeleton Loaders**: `/frontend/job-app/src/components/SkeletonLoader.jsx`

---

## 🆘 Common Issues & Solutions

### **Import Error**
```
Cannot find module '../utils/api'
```
**Solution:** Verify file path is correct and file exists at specified location

### **Loading State Not Displaying**
```
Component renders data immediately without loading state
```
**Solution:** Ensure loading state is initialized as `true` and updated in `finally` block

### **ARIA Validation Warning**
```
aria-label doesn't match button text
```
**Solution:** Provide descriptive, contextual aria-label that explains the action

### **localStorage Access Error**
```
Cannot read property 'user_id' of null
```
**Solution:** Use `getCurrentUserId()` helper function instead of direct localStorage access

---

**Last Updated:** November 2025  
**Version:** 2.0.0
