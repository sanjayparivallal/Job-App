// API Configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// User/Profile APIs
export const fetchUserProfile = async (userId) => {
  return apiRequest(`/profile/${userId}`);
};

// Job APIs
export const fetchAllJobs = async () => {
  return apiRequest('/jobs');
};

export const fetchEmployerJobs = async (employerId) => {
  return apiRequest(`/showemployerjobs/${employerId}`);
};

export const createJob = async (jobData) => {
  return apiRequest('/addjob', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
};

export const deleteJob = async (jobId) => {
  return apiRequest(`/jobs/${jobId}`, {
    method: 'DELETE',
  });
};

// Application APIs
export const fetchApplicationsByEmployer = async (employerId) => {
  return apiRequest(`/applications/${employerId}`);
};

export const fetchApplicationsByApplicant = async (applicantId) => {
  return apiRequest(`/myapplications/${applicantId}`);
};

export const submitApplication = async (applicationData) => {
  return apiRequest('/apply', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
};

export const updateApplicationStatus = async (applicationId, status) => {
  return apiRequest(`/applications/${applicationId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const withdrawApplication = async (applicationId) => {
  return apiRequest(`/applications/${applicationId}`, {
    method: 'DELETE',
  });
};

export const submitApplicationWithResume = async (formData) => {
  const url = `${API_BASE_URL}/apply`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData, // Don't set Content-Type for FormData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Error (apply with resume):', error);
    throw error;
  }
};

export const exportCandidatesToCSV = async (employerId) => {
  const url = `${API_BASE_URL}/export-candidates/${employerId}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Export CSV Error:', error);
    throw error;
  }
};

// Auth APIs
export const loginUser = async (credentials) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const signupUser = async (userData) => {
  return apiRequest('/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export default {
  apiRequest,
  fetchUserProfile,
  fetchAllJobs,
  fetchEmployerJobs,
  createJob,
  deleteJob,
  fetchApplicationsByEmployer,
  fetchApplicationsByApplicant,
  submitApplication,
  submitApplicationWithResume,
  updateApplicationStatus,
  withdrawApplication,
  exportCandidatesToCSV,
  loginUser,
  signupUser,
};
