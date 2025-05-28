// import scholarshipsData from '../data/scholarshipsData.js';
import Scholarship from '../models/Scholarship.js';
import Fuse from 'fuse.js';
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
export const getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find(); // ✅ pulls all from DB
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Match scholarships to student profile
 * @param {Object} req Express request object with profile data
 * @param {Object} res Express response object
 */
export const matchScholarshipsToProfile = async (req, res) => {
  try {
    const profile = req.body;

    const scholarships = await Scholarship.find(); // ← dynamic DB load
    const matchedScholarships = scholarships.map(scholarship => {
      const relevanceScore = calculateRelevanceScore(scholarship, profile);
      return {
        ...scholarship.toObject(),
        relevanceScore
      };
    });

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

const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .split(/\s+/)
    .filter(token => token.length > 2);
};

const createFuse = (scholarship, fields, profileTokens) => {
  const searchCorpus = fields
    .map(field => scholarship[field] || '')
    .join(' ')
    .toLowerCase();

  return new Fuse([searchCorpus], {
    includeScore: true,
    threshold: 0.4, // stricter matching
    useExtendedSearch: true
  });
};

export const calculateRelevanceScore = (scholarship, profile) => {
  let score = 0;
  const maxScore = 100;

  const amount = scholarship.amount === 'Amount Varies'
    ? 0
    : parseInt(scholarship.amount.replace(/[^0-9]/g, '')) || 0;

  const searchableFields = ['name', 'description', 'eligibility'];
  const scholarshipText = searchableFields.map(f => scholarship[f] || '').join(' ').toLowerCase();
  const profileTokens = tokenize(
    `${profile.fieldOfStudy || ''} ${profile.interests?.join(' ') || ''} ${profile.specialCategories?.join(' ') || ''}`
  );

  const fuse = createFuse(scholarship, searchableFields, profileTokens);

  // 1. Amount Matching (20 pts)
  if (profile.desiredAmount) {
    let match = false;
    const amountBrackets = {
      'small': [0, 1000],
      'medium': [1001, 5000],
      'large': [5001, 10000],
      'very-large': [10001, 20000],
      'full-ride': [20001, Infinity],
    };
    const [min, max] = amountBrackets[profile.desiredAmount] || [0, 0];
    if (amount >= min && amount <= max) {
      match = true;
    }
    if (match) score += 20;
  }

  // 2. Fuzzy match with profile keywords (50 pts)
  let matchScore = 0;
  for (const token of profileTokens) {
    const result = fuse.search(token);
    if (result.length > 0 && result[0].score < 0.4) {
      matchScore += 1;
    }
  }
  const maxTokens = profileTokens.length || 1;
  score += Math.min(50, (matchScore / maxTokens) * 50);

  // 3. Special categories exact keyword match (20 pts)
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
  if (profile.specialCategories?.length) {
    profile.specialCategories.forEach(cat => {
      const keywords = categoryKeywords[cat] || [];
      if (keywords.some(keyword => scholarshipText.includes(keyword))) {
        categoryMatchCount++;
      }
    });
    score += Math.min(20, (categoryMatchCount / profile.specialCategories.length) * 20);
  }

  // Add some randomness for tie-breaking
  score += Math.random() * 3;

  return Math.min(Math.max(score, 0), maxScore);
};