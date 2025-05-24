import React, { useState } from 'react';
import { BookOpen, MapPin, GraduationCap, DollarSign, Award } from 'lucide-react';

const StudentForm = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fieldOfStudy: '',
    gpa: '',
    location: '',
    incomeLevel: '',
    specialCategories: [],
    interests: [],
    desiredAmount: '',
  });

  const specialCategoryOptions = [
    { id: 'first-gen', label: 'First Generation Student' },
    { id: 'minority', label: 'Underrepresented Minority' },
    { id: 'veteran', label: 'Veteran/Military' },
    { id: 'international', label: 'International Student' },
    { id: 'athlete', label: 'Student Athlete' },
    { id: 'disability', label: 'Student with Disability' },
    { id: 'lgbtq', label: 'LGBTQ+' },
  ];

  const interestOptions = [
    { id: 'stem', label: 'STEM' },
    { id: 'arts', label: 'Arts & Humanities' },
    { id: 'business', label: 'Business' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'social-sciences', label: 'Social Sciences' },
    { id: 'law', label: 'Law' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, category) => {
    const { checked } = e.target;
    const { name } = e.target.dataset;
    
    if (name === 'specialCategories') {
      setFormData({
        ...formData,
        specialCategories: checked
          ? [...formData.specialCategories, category]
          : formData.specialCategories.filter(cat => cat !== category)
      });
    } else if (name === 'interests') {
      setFormData({
        ...formData,
        interests: checked
          ? [...formData.interests, category]
          : formData.interests.filter(int => int !== category)
      });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card max-w-3xl mx-auto animate-fade-in">
      <div className="card-header bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-xl font-bold font-heading">Find Your Perfect Scholarship</h2>
        <p className="text-blue-100 mt-1">Complete your profile to get personalized scholarship recommendations</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                    ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {step}
                </div>
                <span className="text-xs hidden sm:block">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Academic Details' : 'Preferences'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="relative mt-2">
            <div className="h-1 bg-gray-200 rounded-full">
              <div 
                className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="form-label flex items-center">
                  <MapPin size={16} className="mr-1 text-gray-500" />
                  Location (State/Country)
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="California, USA"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="fieldOfStudy" className="form-label flex items-center">
                  <BookOpen size={16} className="mr-1 text-gray-500" />
                  Field of Study
                </label>
                <input
                  id="fieldOfStudy"
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Computer Science, Medicine, Arts, etc."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gpa" className="form-label flex items-center">
                  <GraduationCap size={16} className="mr-1 text-gray-500" />
                  GPA (0.0 - 4.0)
                </label>
                <input
                  id="gpa"
                  type="number"
                  name="gpa"
                  min="0"
                  max="4.0"
                  step="0.1"
                  value={formData.gpa}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="3.5"
                />
              </div>
              
              <div>
                <label className="form-label">Areas of Interest</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestOptions.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${option.id}`}
                        data-name="interests"
                        checked={formData.interests.includes(option.id)}
                        onChange={(e) => handleCheckboxChange(e, option.id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`interest-${option.id}`} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="incomeLevel" className="form-label flex items-center">
                  <DollarSign size={16} className="mr-1 text-gray-500" />
                  Household Income Level
                </label>
                <select
                  id="incomeLevel"
                  name="incomeLevel"
                  value={formData.incomeLevel}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Income Level</option>
                  <option value="low">Low Income (Below $30,000)</option>
                  <option value="middle-low">Middle-Low Income ($30,000 - $60,000)</option>
                  <option value="middle">Middle Income ($60,000 - $90,000)</option>
                  <option value="middle-high">Middle-High Income ($90,000 - $120,000)</option>
                  <option value="high">High Income (Above $120,000)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="desiredAmount" className="form-label flex items-center">
                  <Award size={16} className="mr-1 text-gray-500" />
                  Desired Scholarship Amount
                </label>
                <select
                  id="desiredAmount"
                  name="desiredAmount"
                  value={formData.desiredAmount}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Any Amount</option>
                  <option value="small">Small Grants (Up to $1,000)</option>
                  <option value="medium">Medium Scholarships ($1,000 - $5,000)</option>
                  <option value="large">Large Scholarships ($5,000 - $10,000)</option>
                  <option value="very-large">Very Large Scholarships (Above $10,000)</option>
                  <option value="full-ride">Full Tuition Scholarships</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Special Categories (if applicable)</label>
                <div className="grid grid-cols-2 gap-2">
                  {specialCategoryOptions.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${option.id}`}
                        data-name="specialCategories"
                        checked={formData.specialCategories.includes(option.id)}
                        onChange={(e) => handleCheckboxChange(e, option.id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`category-${option.id}`} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-secondary ml-auto"
              >
                Find Scholarships
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;