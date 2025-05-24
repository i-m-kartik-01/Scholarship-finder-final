import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:5000/api';

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
  // This is a temporary solution using the data provided in the prompt
  const data = [
    { name: "Niche $15,000 No Essay Scholarship", amount: "$15,000", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1453", source: "Scholarships.com" },
    { name: "Triadex Services Scholarship", amount: "$750", deadline: "Deadline Varies", link: null, source: "Scholarships.com" },
    { name: "$2,000 No Essay Scholarship by Sallie", amount: "$2,000", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1438", source: "Scholarships.com" },
    { name: "SoFi Scholarship Giveaway", amount: "$2,500", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1530", source: "Scholarships.com" },
    { name: "Discover® Scholarship Sweepstakes", amount: "$5,000", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1539", source: "Scholarships.com" },
    { name: "Edvisors $2,500 Monthly Scholarship", amount: "$2,500", deadline: "June 15, 2025", link: "https://www.scholarships.com/scc.aspx?pid=670", source: "Scholarships.com" },
    { name: "SoFi Ambition Sweepstakes", amount: "$20,000", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1523", source: "Scholarships.com" },
    { name: "$25,000 Be Bold No-Essay Scholarship", amount: "$25,000", deadline: "May 31, 2025", link: "https://www.scholarships.com/scc.aspx?pid=1353", source: "Scholarships.com" },
    { name: "Bright HEROs Educational Enrichment Program", amount: "$2,000", deadline: "May 30, 2025", link: null, source: "Scholarships.com" },
    { name: "SBB Research Group STEM Scholarship", amount: "$2,500", deadline: "May 31, 2025", link: null, source: "Scholarships.com" }
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