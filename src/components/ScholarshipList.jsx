import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Calendar, DollarSign, ChevronLeft } from 'lucide-react';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipList = ({ scholarships, studentProfile, favorites, onToggleFavorite, onReset }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    amount: 'all',
    deadline: 'all',
    favorites: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFavoritesFilter = () => {
    setFilters({ ...filters, favorites: !filters.favorites });
  };

  // Apply sorting and filtering
  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];

    // Apply amount filter
    if (filters.amount !== 'all') {
      result = result.filter(scholarship => {
        const amount = scholarship.amount.replace(/[^0-9]/g, '');
        if (filters.amount === 'small' && amount < 1000) return true;
        if (filters.amount === 'medium' && amount >= 1000 && amount < 5000) return true;
        if (filters.amount === 'large' && amount >= 5000 && amount < 20000) return true;
        if (filters.amount === 'very-large' && amount >= 20000) return true;
        return false;
      });
    }

    // Apply deadline filter
    if (filters.deadline !== 'all') {
      const now = new Date();
      const oneMonth = new Date();
      oneMonth.setMonth(oneMonth.getMonth() + 1);
      const threeMonths = new Date();
      threeMonths.setMonth(threeMonths.getMonth() + 3);

      result = result.filter(scholarship => {
        if (scholarship.deadline === 'Deadline Varies') return true;
        
        const deadlineDate = new Date(scholarship.deadline);
        
        if (filters.deadline === 'urgent' && deadlineDate <= oneMonth) return true;
        if (filters.deadline === 'upcoming' && deadlineDate > oneMonth && deadlineDate <= threeMonths) return true;
        if (filters.deadline === 'future' && deadlineDate > threeMonths) return true;
        
        return false;
      });
    }

    // Apply favorites filter
    if (filters.favorites) {
      result = result.filter(scholarship => favorites.includes(scholarship.name));
    }

    // Apply sorting
    if (sortBy === 'amount') {
      result.sort((a, b) => {
        // Convert amount strings to numbers for comparison
        const amountA = a.amount === 'Amount Varies' ? 0 : parseInt(a.amount.replace(/[^0-9]/g, '')) || 0;
        const amountB = b.amount === 'Amount Varies' ? 0 : parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
        return amountB - amountA;
      });
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => {
        if (a.deadline === 'Deadline Varies') return 1;
        if (b.deadline === 'Deadline Varies') return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    }
    // 'relevance' sorting is assumed to be the default order

    return result;
  }, [scholarships, sortBy, filters, favorites]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back to Profile</span>
        </button>
        
        <h2 className="text-2xl font-bold font-heading text-center text-gray-800">
          Your Matching Scholarships
        </h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <p className="text-gray-600 text-sm">
              Found <span className="font-semibold">{filteredScholarships.length}</span> matching scholarships for your profile
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3 md:mt-0">
            <div className="flex items-center">
              <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2 whitespace-nowrap">
                <ArrowUpDown size={16} className="inline mr-1" /> Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="form-input py-1 px-2 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="deadline">Deadline</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
            >
              <Filter size={16} className="mr-1" />
              Filters {showFilters ? '▲' : '▼'}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={14} className="inline mb-0.5" /> Amount
                </label>
                <select
                  id="amount"
                  name="amount"
                  value={filters.amount}
                  onChange={handleFilterChange}
                  className="form-input text-sm py-1"
                >
                  <option value="all">All Amounts</option>
                  <option value="small">Small (≤ $1,000)</option>
                  <option value="medium">Medium ($1,000 - $5,000)</option>
                  <option value="large">Large ($5,000 - $20,000)</option>
                  <option value="very-large">Very Large (≥ $20,000)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline mb-0.5" /> Deadline
                </label>
                <select
                  id="deadline"
                  name="deadline"
                  value={filters.deadline}
                  onChange={handleFilterChange}
                  className="form-input text-sm py-1"
                >
                  <option value="all">All Deadlines</option>
                  <option value="urgent">Urgent (≤ 1 month)</option>
                  <option value="upcoming">Upcoming (1-3 months)</option>
                  <option value="future">Future (&get; 3 months)</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleFavoritesFilter}
                  className={`text-sm py-1 px-3 rounded-md transition-colors ${
                    filters.favorites
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filters.favorites ? 'Show All' : 'Show Favorites Only'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship, index) => (
            <ScholarshipCard
              key={`${scholarship.name}-${index}`}
              scholarship={scholarship}
              isFavorite={favorites.includes(scholarship.name)}
              onToggleFavorite={() => onToggleFavorite(scholarship.name)}
              animationDelay={index * 0.1}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No matching scholarships found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or updating your profile to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipList;
