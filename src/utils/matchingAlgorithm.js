/**
 * Match scholarships to student profile
 * @param {Array} scholarships Array of scholarship objects
 * @param {Object} profile Student profile data
 * @returns {Array} Array of matched scholarship objects with relevance scores
 */
export const matchScholarships = (scholarships, profile) => {
  if (!scholarships || !scholarships.length) return [];
  
  // Calculate relevance score for each scholarship
  const matchedScholarships = scholarships.map(scholarship => {
    const relevanceScore = calculateRelevanceScore(scholarship, profile);
    return {
      ...scholarship,
      relevanceScore
    };
  });
  
  // Sort by relevance score (descending)
  return matchedScholarships
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Calculate relevance score for a scholarship based on profile
 * @param {Object} scholarship Scholarship object
 * @param {Object} profile Student profile data
 * @returns {number} Relevance score (0-100)
 */
const calculateRelevanceScore = (scholarship, profile) => {
  let score = 0;
  const maxScore = 100;
  
  // Extract numeric amount for comparison
  const scholarshipAmount = scholarship.amount === 'Amount Varies' 
    ? 0 
    : parseInt(scholarship.amount.replace(/[^0-9]/g, '')) || 0;
  
  // Basic matching algorithm (simplified for demo)
  
  // 1. Match by amount preference (30 points)
  if (profile.desiredAmount) {
    if (profile.desiredAmount === 'small' && scholarshipAmount <= 1000) {
      score += 30;
    } else if (profile.desiredAmount === 'medium' && scholarshipAmount > 1000 && scholarshipAmount <= 5000) {
      score += 30;
    } else if (profile.desiredAmount === 'large' && scholarshipAmount > 5000 && scholarshipAmount <= 10000) {
      score += 30;
    } else if (profile.desiredAmount === 'very-large' && scholarshipAmount > 10000) {
      score += 30;
    } else if (profile.desiredAmount === 'full-ride' && scholarshipAmount > 20000) {
      score += 30;
    }
  }
  
  // 2. Match by field of study keywords (30 points)
  if (profile.fieldOfStudy && scholarship.name) {
    const fieldKeywords = profile.fieldOfStudy.toLowerCase().split(/\s+/);
    const scholarshipNameLower = scholarship.name.toLowerCase();
    
    // Check for field of study keywords in scholarship name
    const hasFieldMatch = fieldKeywords.some(keyword => 
      scholarshipNameLower.includes(keyword) && keyword.length > 3
    );
    
    if (hasFieldMatch) {
      score += 30;
    }
  }
  
  // 3. Match by interests (20 points)
  if (profile.interests && profile.interests.length && scholarship.name) {
    const scholarshipNameLower = scholarship.name.toLowerCase();
    
    // Map interests to keywords
    const interestKeywords = {
      'stem': ['science', 'technology', 'engineering', 'math', 'stem', 'research'],
      'arts': ['art', 'music', 'theater', 'design', 'creative', 'humanities'],
      'business': ['business', 'entrepreneur', 'finance', 'marketing', 'management'],
      'healthcare': ['health', 'medical', 'nursing', 'medicine', 'dental', 'pharmacy'],
      'education': ['education', 'teaching', 'teacher', 'school'],
      'social-sciences': ['social', 'psychology', 'sociology', 'anthropology', 'political'],
      'law': ['law', 'legal', 'justice', 'attorney', 'paralegal']
    };
    
    // Check for interest keywords in scholarship name
    let interestMatchCount = 0;
    
    profile.interests.forEach(interest => {
      const keywords = interestKeywords[interest] || [];
      if (keywords.some(keyword => scholarshipNameLower.includes(keyword))) {
        interestMatchCount++;
      }
    });
    
    // Score based on percentage of matched interests
    if (profile.interests.length > 0) {
      score += Math.min(20, (interestMatchCount / profile.interests.length) * 20);
    }
  }
  
  // 4. Match by special categories (20 points)
  if (profile.specialCategories && profile.specialCategories.length && scholarship.name) {
    const scholarshipNameLower = scholarship.name.toLowerCase();
    
    // Map special categories to keywords
    const categoryKeywords = {
      'first-gen': ['first generation', 'first-gen', 'first gen'],
      'minority': ['minority', 'diverse', 'diversity', 'underrepresented'],
      'veteran': ['veteran', 'military', 'service', 'armed forces'],
      'international': ['international', 'foreign', 'global'],
      'athlete': ['athlete', 'sports', 'athletic'],
      'disability': ['disability', 'disabled', 'accessible', 'special needs'],
      'lgbtq': ['lgbtq', 'lgbt', 'gender', 'identity', 'queer', 'gay', 'lesbian']
    };
    
    // Check for category keywords in scholarship name
    let categoryMatchCount = 0;
    
    profile.specialCategories.forEach(category => {
      const keywords = categoryKeywords[category] || [];
      if (keywords.some(keyword => scholarshipNameLower.includes(keyword))) {
        categoryMatchCount++;
      }
    });
    
    // Score based on percentage of matched categories
    if (profile.specialCategories.length > 0) {
      score += Math.min(20, (categoryMatchCount / profile.specialCategories.length) * 20);
    }
  }
  
  // Add random factor for variety (±10 points)
  score += Math.random() * 10;
  
  // Ensure score is within bounds
  return Math.min(Math.max(score, 0), maxScore);
};