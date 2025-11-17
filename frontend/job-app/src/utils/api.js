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
  return apiRequest('/jobs', {
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
  updateApplicationStatus,
  loginUser,
  signupUser,
};
