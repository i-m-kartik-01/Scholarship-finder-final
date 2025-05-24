// import scholarshipsData from '../data/scholarshipsData.js';
import Scholarship from '../models/Scholarship.js';

/**
 * Get all scholarships
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
export const seedScholarships = async () => {
  try {
    await Scholarship.deleteMany();
    await Scholarship.insertMany(scholarshipsData);
    console.log('✅ Scholarships seeded');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};
export const getScholarships = (req, res) => {
  try {
    res.status(200).json(scholarshipsData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Match scholarships to student profile
 * @param {Object} req Express request object with profile data
 * @param {Object} res Express response object
 */
export const matchScholarshipsToProfile = (req, res) => {
  try {
    const profile = req.body;

    // Calculate relevance score for each scholarship
    const matchedScholarships = scholarshipsData.map(scholarship => {
      const relevanceScore = calculateRelevanceScore(scholarship, profile);
      return {
        ...scholarship,
        relevanceScore
      };
    });

    // Filter out low-relevance results and sort by score
    const sortedResults = matchedScholarships
      .filter(s => s.relevanceScore >= 30)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.status(200).json(sortedResults);
  } catch (error) {
    res.status(500).json({ message: 'Matching error', error: error.message });
  }
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

  const scholarshipAmount = scholarship.amount === 'Amount Varies'
    ? 0
    : parseInt(scholarship.amount.replace(/[^0-9]/g, '')) || 0;

  // 1. Match by amount preference (20 points)
  if (profile.desiredAmount) {
    let amountMatch = false;
    if (profile.desiredAmount === 'small' && scholarshipAmount <= 1000) amountMatch = true;
    else if (profile.desiredAmount === 'medium' && scholarshipAmount > 1000 && scholarshipAmount <= 5000) amountMatch = true;
    else if (profile.desiredAmount === 'large' && scholarshipAmount > 5000 && scholarshipAmount <= 10000) amountMatch = true;
    else if (profile.desiredAmount === 'very-large' && scholarshipAmount > 10000) amountMatch = true;
    else if (profile.desiredAmount === 'full-ride' && scholarshipAmount > 20000) amountMatch = true;

    if (amountMatch) score += 20;
  }

  // 2. Match by field of study keywords (30 points)
  if (profile.fieldOfStudy && scholarship.name) {
    const fieldKeywords = profile.fieldOfStudy.toLowerCase().split(/\s+/);
    const scholarshipNameLower = scholarship.name.toLowerCase();
    const hasFieldMatch = fieldKeywords.some(keyword => 
      scholarshipNameLower.includes(keyword) && keyword.length > 3
    );
    if (hasFieldMatch) score += 30;
  }

  // 3. Match by special categories (25 points)
  if (profile.specialCategories && profile.specialCategories.length && scholarship.name) {
    const scholarshipNameLower = scholarship.name.toLowerCase();
    const categoryKeywords = {
      'first-gen': ['first generation', 'first-gen', 'first gen'],
      'minority': ['minority', 'diverse', 'diversity', 'underrepresented'],
      'veteran': ['veteran', 'military', 'service', 'armed forces'],
      'international': ['international', 'foreign', 'global'],
      'athlete': ['athlete', 'sports', 'athletic'],
      'disability': ['disability', 'disabled', 'accessible', 'special needs'],
      'lgbtq': ['lgbtq', 'lgbt', 'gender', 'identity', 'queer', 'gay', 'lesbian']
    };

    let categoryMatchCount = 0;
    profile.specialCategories.forEach(category => {
      const keywords = categoryKeywords[category] || [];
      if (keywords.some(keyword => scholarshipNameLower.includes(keyword))) {
        categoryMatchCount++;
      }
    });

    if (profile.specialCategories.length > 0) {
      score += Math.min(25, (categoryMatchCount / profile.specialCategories.length) * 25);
    }
  }

  // 4. Match by interests (25 points)
  if (profile.interests && profile.interests.length && scholarship.name) {
    const scholarshipNameLower = scholarship.name.toLowerCase();
    const interestKeywords = {
      'stem': ['science', 'technology', 'engineering', 'math', 'stem', 'research'],
      'arts': ['art', 'music', 'theater', 'design', 'creative', 'humanities'],
      'business': ['business', 'entrepreneur', 'finance', 'marketing', 'management'],
      'healthcare': ['health', 'medical', 'nursing', 'medicine', 'dental', 'pharmacy'],
      'education': ['education', 'teaching', 'teacher', 'school'],
      'social-sciences': ['social', 'psychology', 'sociology', 'anthropology', 'political'],
      'law': ['law', 'legal', 'justice', 'attorney', 'paralegal']
    };

    let interestMatchCount = 0;
    profile.interests.forEach(interest => {
      const keywords = interestKeywords[interest] || [];
      if (keywords.some(keyword => scholarshipNameLower.includes(keyword))) {
        interestMatchCount++;
      }
    });

    if (profile.interests.length > 0) {
      score += Math.min(25, (interestMatchCount / profile.interests.length) * 25);
    }
  }

  // Add small randomness for variety (±3 points)
  score += Math.random() * 3;

  return Math.min(Math.max(score, 0), maxScore);
};