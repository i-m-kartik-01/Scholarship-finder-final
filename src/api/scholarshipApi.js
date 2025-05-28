import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5002/api';

/**
 * Fetch all scholarships from the API
 * @returns {Promise<Array>} Array of scholarship objects
 */
export const fetchScholarships = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scholarships`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    
    // Fallback to local data if API fails
    return fetchLocalScholarships();
  }
};

/**
 * Fetch scholarships from local data (fallback)
 * @returns {Promise<Array>} Array of scholarship objects
 */
const fetchLocalScholarships = async () => {
  const data = [
    
  ];
  
  return data;
};

/**
 * Submit student profile to get matched scholarships
 * @param {Object} profile Student profile data
 * @returns {Promise<Array>} Array of matched scholarship objects
 */
export const submitStudentProfile = async (profile) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/match`, profile);
    return response.data;
  } catch (error) {
    console.error('Error submitting profile:', error);
    throw error;
  }
};