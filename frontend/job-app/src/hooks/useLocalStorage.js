import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value
 * @returns {Array} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

/**
 * Get current user ID from localStorage
 * @returns {string|null} - User ID or null
 */
export const getCurrentUserId = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ID);
};

/**
 * Get current username from localStorage
 * @returns {string|null} - Username or null
 */
export const getCurrentUsername = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.USERNAME);
};

export default useLocalStorage;
