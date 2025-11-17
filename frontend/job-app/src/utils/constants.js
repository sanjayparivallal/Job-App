// Application constants

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const LOCAL_STORAGE_KEYS = {
  USER_ID: 'user_id',
  USERNAME: 'username',
};

export const DEBOUNCE_DELAY = 300; // milliseconds

export const ERROR_MESSAGES = {
  LOGIN_REQUIRED: 'You must be logged in to perform this action.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please try again.',
};

export const SUCCESS_MESSAGES = {
  JOB_CREATED: 'Job posted successfully!',
  JOB_DELETED: 'Job deleted successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  APPLICATION_UPDATED: 'Application status updated successfully!',
};
