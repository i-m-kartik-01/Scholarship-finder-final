import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import ScholarshipList from './components/ScholarshipList';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingState from './components/LoadingState';
import { fetchScholarships } from './api/scholarshipApi';

function App() {
  const [scholarships, setScholarships] = useState([]);
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch scholarships on component mount
  useEffect(() => {
    const getScholarships = async () => {
      try {
        setLoading(true);
        const data = await fetchScholarships();
        setScholarships(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load scholarships. Please try again later.');
        setLoading(false);
      }
    };

    getScholarships();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleProfileSubmit = (profile) => {
    setLoading(true);
    setStudentProfile(profile);
    
    // Send profile to backend for matching
    fetch('http://localhost:5000/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
      .then(response => response.json())
      .then(data => {
        setMatchedScholarships(data);
        setFormSubmitted(true);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error matching scholarships:', err);
        // Fallback to frontend matching if backend fails
        import('./utils/matchingAlgorithm').then(module => {
          const { matchScholarships } = module;
          const matched = matchScholarships(scholarships, profile);
          setMatchedScholarships(matched);
          setFormSubmitted(true);
          setLoading(false);
        });
      });
  };

  const toggleFavorite = (scholarshipId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(scholarshipId)) {
        return prevFavorites.filter(id => id !== scholarshipId);
      } else {
        return [...prevFavorites, scholarshipId];
      }
    });
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setStudentProfile(null);
    setMatchedScholarships([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header resetForm={resetForm} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {!formSubmitted ? (
              <div className="max-w-3xl mx-auto">
                <StudentForm onSubmit={handleProfileSubmit} />
              </div>
            ) : (
              <div className="animate-fade-in">
                <ScholarshipList 
                  scholarships={matchedScholarships} 
                  studentProfile={studentProfile}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onReset={resetForm} 
                />
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;